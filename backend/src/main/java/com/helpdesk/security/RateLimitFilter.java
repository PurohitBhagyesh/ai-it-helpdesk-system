package com.helpdesk.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * IP-Based Rate Limiting Filter to prevent DoS & brute force attacks
 */
@Component
@Order(1)
public class RateLimitFilter implements Filter {

    @Value("${app.security.rate-limit.max-requests-per-minute:120}")
    private int maxRequestsPerMinute;

    private static final long TIME_WINDOW_MS = 60_000L; // 1 minute

    private final ConcurrentHashMap<String, ClientRequestTracker> requestCounts = new ConcurrentHashMap<>();

    private static class ClientRequestTracker {
        long windowStart;
        AtomicInteger count;

        ClientRequestTracker(long windowStart) {
            this.windowStart = windowStart;
            this.count = new AtomicInteger(1);
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Skip rate limiting for static health checks or preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod()) || httpRequest.getRequestURI().contains("/h2-console")) {
            chain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIP(httpRequest);
        long now = System.currentTimeMillis();

        ClientRequestTracker tracker = requestCounts.compute(clientIp, (ip, currentTracker) -> {
            if (currentTracker == null || (now - currentTracker.windowStart) > TIME_WINDOW_MS) {
                return new ClientRequestTracker(now);
            }
            currentTracker.count.incrementAndGet();
            return currentTracker;
        });

        int currentRequests = tracker.count.get();
        int remaining = Math.max(0, maxRequestsPerMinute - currentRequests);

        httpResponse.setHeader("X-RateLimit-Limit", String.valueOf(maxRequestsPerMinute));
        httpResponse.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));

        if (currentRequests > maxRequestsPerMinute) {
            httpResponse.setStatus(429); // 429 Too Many Requests
            httpResponse.setHeader("Retry-After", "60");
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"Rate limit exceeded. Please try again in 1 minute.\", \"status\": 429}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
