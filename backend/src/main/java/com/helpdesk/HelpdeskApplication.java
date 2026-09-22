package com.helpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HelpdeskApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelpdeskApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 AI IT Support & Helpdesk Backend Running!");
        System.out.println("📡 Server URL: http://localhost:8080");
        System.out.println("📊 API Endpoints: http://localhost:8080/api/tickets");
        System.out.println("🗄️ H2 Console: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
