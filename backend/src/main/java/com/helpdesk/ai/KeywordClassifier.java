package com.helpdesk.ai;

import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class KeywordClassifier {

    private final Map<Category, List<String>> categoryKeywords = new EnumMap<>(Category.class);
    private final List<String> highPriorityKeywords = Arrays.asList(
            "urgent", "emergency", "outage", "security", "critical", "black", 
            "stopped", "broken", "danger", "cannot work", "production", "crash loop", "freeze"
    );
    private final List<String> lowPriorityKeywords = Arrays.asList(
            "password", "how to", "inquiry", "general", "minor", "feature", "access request", "info"
    );

    public KeywordClassifier() {
        categoryKeywords.put(Category.NETWORK, Arrays.asList(
                "wifi", "wi-fi", "internet", "router", "network", "connection", "vpn", "dns", "ethernet", "ip", "slow internet"
        ));
        categoryKeywords.put(Category.HARDWARE, Arrays.asList(
                "laptop", "keyboard", "mouse", "monitor", "printer", "screen", "battery", "charger", "display", "power", "device", "pc"
        ));
        categoryKeywords.put(Category.SOFTWARE, Arrays.asList(
                "application", "software", "crash", "error", "install", "update", "browser", "chrome", "freeze", "bug", "app", "windows", "excel"
        ));
        categoryKeywords.put(Category.ACCESS, Arrays.asList(
                "password", "login", "account", "permission", "access", "username", "locked", "credential", "auth", "sign in", "reset password"
        ));
    }

    public Category classifyCategory(String text) {
        if (text == null || text.trim().isEmpty()) {
            return Category.OTHER;
        }

        String lower = text.toLowerCase();
        Map<Category, Integer> scores = new EnumMap<>(Category.class);

        for (Map.Entry<Category, List<String>> entry : categoryKeywords.entrySet()) {
            int score = 0;
            for (String kw : entry.getValue()) {
                if (lower.contains(kw)) {
                    score += 2;
                }
            }
            scores.put(entry.getKey(), score);
        }

        Category bestCategory = Category.OTHER;
        int maxScore = 0;
        for (Map.Entry<Category, Integer> entry : scores.entrySet()) {
            if (entry.getValue() > maxScore) {
                maxScore = entry.getValue();
                bestCategory = entry.getKey();
            }
        }

        return maxScore > 0 ? bestCategory : Category.SOFTWARE;
    }

    public Priority recommendPriority(String text, Category category) {
        if (text == null) return Priority.MEDIUM;
        String lower = text.toLowerCase();

        for (String kw : highPriorityKeywords) {
            if (lower.contains(kw)) {
                return Priority.HIGH;
            }
        }

        for (String kw : lowPriorityKeywords) {
            if (lower.contains(kw)) {
                return Priority.LOW;
            }
        }

        if (category == Category.NETWORK || category == Category.HARDWARE) {
            return Priority.MEDIUM;
        }

        return Priority.MEDIUM;
    }
}
