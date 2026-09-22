package com.helpdesk.ai;

import com.helpdesk.model.Category;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class SolutionAdvisor {

    private final Map<Category, String> solutions = new EnumMap<>(Category.class);

    public SolutionAdvisor() {
        solutions.put(Category.NETWORK, 
                "Verify your Wi-Fi/Ethernet adapter is active, try turning airplane mode ON and OFF, or restart your local router/switch.");
        solutions.put(Category.HARDWARE, 
                "Check physical cable connections, ensure the charger/power supply is working, and try power-cycling the device (press & hold power button for 15 seconds).");
        solutions.put(Category.SOFTWARE, 
                "Close and restart the affected application, verify if pending OS/software updates are available, or try clearing browser cache.");
        solutions.put(Category.ACCESS, 
                "Check Caps Lock, verify your employee ID/domain syntax, or use the corporate self-service password recovery portal.");
        solutions.put(Category.OTHER, 
                "Please document any error codes or recent changes to help the IT support team diagnose the issue quickly.");
    }

    public String suggestSolution(Category category, String text) {
        if (category == null) category = Category.OTHER;
        return solutions.getOrDefault(category, solutions.get(Category.OTHER));
    }
}
