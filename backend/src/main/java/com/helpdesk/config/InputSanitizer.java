package com.helpdesk.config;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Sanitizer utility to prevent XSS (Cross-Site Scripting) and SQL Injection attacks
 * across user-provided input strings before persisting or logging.
 */
@Component
public class InputSanitizer {

    private static final Pattern SCRIPT_TAG_PATTERN = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern SRC_PATTERN = Pattern.compile("src[\\r\\n]*=[\\r\\n]*\\'(.*?)\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private static final Pattern EVAL_PATTERN = Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private static final Pattern EXPRESSION_PATTERN = Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private static final Pattern JAVASCRIPT_PATTERN = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
    private static final Pattern ONERROR_PATTERN = Pattern.compile("onerror[\\s]*=", Pattern.CASE_INSENSITIVE);
    private static final Pattern ONLOAD_PATTERN = Pattern.compile("onload[\\s]*=", Pattern.CASE_INSENSITIVE);
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]*>");

    /**
     * Sanitizes input text by removing HTML/Script tags and unescaping dangerous control characters.
     *
     * @param input Raw input string
     * @return Cleaned, safe string
     */
    public String sanitize(String input) {
        if (input == null) {
            return null;
        }

        String cleaned = input;

        cleaned = SCRIPT_TAG_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = SRC_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = EVAL_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = EXPRESSION_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = JAVASCRIPT_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = ONERROR_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = ONLOAD_PATTERN.matcher(cleaned).replaceAll("");
        cleaned = HTML_TAG_PATTERN.matcher(cleaned).replaceAll("");

        cleaned = cleaned.replace("&", "&amp;")
                         .replace("<", "&lt;")
                         .replace(">", "&gt;")
                         .replace("\"", "&quot;")
                         .replace("'", "&#x27;");

        return cleaned.trim();
    }
}
