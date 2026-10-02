package com.helpdesk.service;

import com.helpdesk.dto.AIAnalysisResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;

/**
 * AI Classification Engine and Diagnostic Solution Advisor.
 * Analyzes technical incident descriptions using keyword weighting,
 * urgency heuristic scoring, and domain troubleshooting knowledge.
 */
@Service
public class AIService {

    private static final List<String> NETWORK_KEYWORDS = Arrays.asList(
        "wifi", "wi-fi", "network", "internet", "vpn", "router", "dns", "ip", "connection", "bandwidth",
        "ping", "packet", "latency", "firewall", "ethernet", "lan", "wan", "slow internet", "disconnect"
    );

    private static final List<String> HARDWARE_KEYWORDS = Arrays.asList(
        "laptop", "desktop", "monitor", "screen", "keyboard", "mouse", "printer", "battery", "charger",
        "disk", "hard drive", "ssd", "ram", "memory", "cpu", "motherboard", "overheating", "blue screen",
        "bsod", "hardware", "device", "power supply"
    );

    private static final List<String> SOFTWARE_KEYWORDS = Arrays.asList(
        "software", "app", "application", "excel", "word", "outlook", "office", "browser", "chrome",
        "crash", "freeze", "bug", "error", "update", "installation", "install", "license", "teams",
        "zoom", "slack", "operating system", "windows", "mac", "os"
    );

    private static final List<String> ACCESS_KEYWORDS = Arrays.asList(
        "password", "login", "access", "permission", "account", "locked", "mfa", "2fa", "authentication",
        "credential", "role", "sso", "reset", "forgot password", "unauthorized", "active directory"
    );

    private static final List<String> HIGH_URGENCY_KEYWORDS = Arrays.asList(
        "urgent", "critical", "outage", "down", "emergency", "system down", "broken", "blocked",
        "cannot work", "dead", "compromised", "breach", "immediately", "asap"
    );

    private static final List<String> MEDIUM_URGENCY_KEYWORDS = Arrays.asList(
        "error", "slow", "failing", "warning", "issue", "problem", "glitch", "degraded", "intermittent"
    );

    /**
     * Analyzes problem text to derive category, priority recommendation, and self-service diagnostic suggestions.
     *
     * @param title       Incident problem summary
     * @param description Incident detailed description
     * @return AIAnalysisResponse DTO containing classification results
     */
    public AIAnalysisResponse analyzeProblem(String title, String description) {
        String combinedText = ((title != null ? title : "") + " " + (description != null ? description : "")).toLowerCase(Locale.ROOT);

        Map<String, Integer> categoryScores = new HashMap<>();
        categoryScores.put("NETWORK", calculateScore(combinedText, NETWORK_KEYWORDS));
        categoryScores.put("HARDWARE", calculateScore(combinedText, HARDWARE_KEYWORDS));
        categoryScores.put("SOFTWARE", calculateScore(combinedText, SOFTWARE_KEYWORDS));
        categoryScores.put("ACCESS", calculateScore(combinedText, ACCESS_KEYWORDS));

        String bestCategory = "SOFTWARE";
        int maxScore = 0;
        for (Map.Entry<String, Integer> entry : categoryScores.entrySet()) {
            if (entry.getValue() > maxScore) {
                maxScore = entry.getValue();
                bestCategory = entry.getKey();
            }
        }

        String recommendedPriority = determinePriority(combinedText, maxScore);
        String suggestedSolution = generateDiagnosticSuggestion(bestCategory, combinedText);

        return new AIAnalysisResponse(bestCategory, recommendedPriority, suggestedSolution);
    }

    private int calculateScore(String text, List<String> keywords) {
        int score = 0;
        for (String kw : keywords) {
            if (text.contains(kw)) {
                score++;
            }
        }
        return score;
    }

    private String determinePriority(String text, int categoryMatchCount) {
        for (String urgentKw : HIGH_URGENCY_KEYWORDS) {
            if (text.contains(urgentKw)) {
                return "HIGH";
            }
        }

        for (String medKw : MEDIUM_URGENCY_KEYWORDS) {
            if (text.contains(medKw)) {
                return "MEDIUM";
            }
        }

        if (categoryMatchCount >= 3) {
            return "MEDIUM";
        }

        return "LOW";
    }

    private String generateDiagnosticSuggestion(String category, String text) {
        switch (category) {
            case "NETWORK":
                if (text.contains("vpn")) {
                    return "1. Disconnect and reconnect to the enterprise VPN gateway.\n2. Verify your multi-factor authentication (MFA) dynamic token.\n3. Flush your DNS cache via terminal (`ipconfig /flushdns`).";
                }
                if (text.contains("wifi") || text.contains("wi-fi")) {
                    return "1. Toggle Wi-Fi adapter off and on.\n2. Forget the corporate SSID and reconnect using domain credentials.\n3. Ensure airplane mode is disabled.";
                }
                return "1. Check physical Ethernet cable seating or Wi-Fi status.\n2. Test connection by pinging default gateway (`ping 192.168.1.1`).\n3. Restart local network adapter.";

            case "HARDWARE":
                if (text.contains("screen") || text.contains("monitor")) {
                    return "1. Re-seat DisplayPort / HDMI cables at both host and monitor ends.\n2. Cycle monitor power and verify correct input source (HDMI/DP).\n3. Try connecting an external display to rule out GPU failure.";
                }
                if (text.contains("battery") || text.contains("power") || text.contains("charger")) {
                    return "1. Verify charger connection LED.\n2. Perform a hard reset by holding the power button for 15 seconds.\n3. Connect to a known good wall outlet without dock extenders.";
                }
                return "1. Ensure all physical peripheral connections are secure.\n2. Run embedded hardware diagnostics (F12 on boot for Dell / HP diagnostics).\n3. Restart device to reset hardware controller state.";

            case "ACCESS":
                if (text.contains("password") || text.contains("locked") || text.contains("reset")) {
                    return "1. Use self-service Identity Management Portal at `https://identity.enterprise.org/reset`.\n2. Wait 15 minutes if locked due to failed attempts.\n3. Contact Admin if active directory account is expired.";
                }
                if (text.contains("mfa") || text.contains("2fa")) {
                    return "1. Sync device time in Authenticator settings.\n2. Request temporary bypass code through Security Desk.\n3. Ensure phone network time is set automatically.";
                }
                return "1. Confirm domain credentials format (`domain\\username`).\n2. Clear browser cache and stored authentication sessions.\n3. Request access permission escalation via Admin Enquiry.";

            case "SOFTWARE":
            default:
                if (text.contains("outlook") || text.contains("email") || text.contains("office")) {
                    return "1. Start application in Safe Mode (`outlook.exe /safe`).\n2. Clear application cache in `%appdata%\\Microsoft\\`.\n3. Run Quick Repair via Control Panel -> Programs & Features.";
                }
                if (text.contains("crash") || text.contains("freeze")) {
                    return "1. Terminate stalled processes via Task Manager / Activity Monitor.\n2. Verify latest software updates and security patches are installed.\n3. Check system memory usage for leaks.";
                }
                return "1. Save open work and restart the application.\n2. Verify system compatibility and missing runtime dependencies.\n3. Reinstall application from official Enterprise Software Center.";
        }
    }
}
