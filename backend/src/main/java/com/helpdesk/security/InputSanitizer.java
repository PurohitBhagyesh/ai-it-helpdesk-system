package com.helpdesk.security;

import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

/**
 * Enterprise Input Sanitizer for SQL Injection & XSS Mitigation
 */
@Component
public class InputSanitizer {

    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script>(.*?)</script>|javascript:|onerror=|onload=", Pattern.CASE_INSENSITIVE);
    private static final Pattern SQL_META_PATTERN = Pattern.compile("([';]+|--|/\\*|\\*/|xp_|union\\s+select|drop\\s+table|drop\\s+database)", Pattern.CASE_INSENSITIVE);
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");

    /**
     * Sanitizes user text against XSS, HTML injections, and malicious control characters
     */
    public String sanitizeText(String input) {
        if (input == null) return null;
        
        String clean = input.trim();
        // Remove null bytes
        clean = clean.replace("\0", "");
        // Remove script tags and dangerous event handlers
        clean = SCRIPT_PATTERN.matcher(clean).replaceAll("");
        // Strip unsafe HTML markup
        clean = HTML_TAG_PATTERN.matcher(clean).replaceAll("");
        
        return clean;
    }

    /**
     * Checks if a string contains known dangerous SQL injection signatures
     */
    public boolean containsSqlInjectionSignatures(String input) {
        if (input == null || input.isEmpty()) return false;
        return SQL_META_PATTERN.matcher(input).find();
    }
}
