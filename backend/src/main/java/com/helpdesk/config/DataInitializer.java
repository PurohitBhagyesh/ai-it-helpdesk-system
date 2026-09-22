package com.helpdesk.config;

import com.helpdesk.model.*;
import com.helpdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final TicketMessageRepository messageRepository;
    private final ResolutionRepository resolutionRepository;

    @Value("${app.security.admin.name:System Administrator}")
    private String adminName;

    @Value("${app.security.admin.email:admin@helpdesk.com}")
    private String adminEmail;

    @Value("${app.security.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.security.admin.department:IT Operations}")
    private String adminDept;

    @Autowired
    public DataInitializer(UserRepository userRepository, TicketRepository ticketRepository,
                           TicketMessageRepository messageRepository, ResolutionRepository resolutionRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.resolutionRepository = resolutionRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already exists
        }

        System.out.println("🌱 Initializing Configured Helpdesk Accounts & Sample Data...");

        // 1. Create Initial Administrator from Configured Properties / Environment Variables
        User admin = new User(adminName, adminEmail, adminPassword, Role.ADMIN, adminDept);
        admin.setCompanyName("Acme Global Technologies");
        admin.setEmployeeIdCode("ADM-001");
        admin.setJoinDate("2024-01-15");
        admin.setDesignation("Chief Information Security Officer");
        admin.setPhone("+1 (800) 555-0100");
        admin = userRepository.save(admin);

        // 2. Create Default Test Accounts
        User staffAlex = new User("Alex Support", "alex.staff@helpdesk.com", "staff123", Role.IT_STAFF, "IT Support Team");
        staffAlex.setCompanyName("Acme Global Technologies");
        staffAlex.setEmployeeIdCode("TECH-201");
        staffAlex.setJoinDate("2024-06-01");
        staffAlex.setDesignation("Senior IT Support Engineer");
        staffAlex.setExperience("5 Years - Hardware & Tier-1 Support");
        staffAlex.setSpecialization("Workstation Diagnostics, macOS/Windows, Network Triage");
        staffAlex.setPhone("+1 (800) 555-0201");
        staffAlex = userRepository.save(staffAlex);

        User staffSarah = new User("Sarah Engineer", "sarah.staff@helpdesk.com", "staff123", Role.IT_STAFF, "Network Operations");
        staffSarah.setCompanyName("Acme Global Technologies");
        staffSarah.setEmployeeIdCode("TECH-202");
        staffSarah.setJoinDate("2023-11-15");
        staffSarah.setDesignation("Lead Infrastructure Specialist");
        staffSarah.setExperience("7 Years - Cloud & Cisco Network Eng");
        staffSarah.setSpecialization("Cisco CCNA, VPN Gateways, Firewalls, AWS VPC");
        staffSarah.setPhone("+1 (800) 555-0202");
        staffSarah = userRepository.save(staffSarah);

        User empJohn = new User("John Doe", "john.doe@company.com", "employee123", Role.EMPLOYEE, "Finance");
        empJohn.setCompanyName("Acme Global Technologies");
        empJohn.setEmployeeIdCode("EMP-101");
        empJohn.setJoinDate("2025-02-10");
        empJohn.setDesignation("Financial Analyst");
        empJohn.setPhone("+1 (800) 555-0101");
        empJohn = userRepository.save(empJohn);

        User empEmily = new User("Emily Davis", "emily.davis@company.com", "employee123", Role.EMPLOYEE, "Marketing");
        empEmily.setCompanyName("Acme Global Technologies");
        empEmily.setEmployeeIdCode("EMP-102");
        empEmily.setJoinDate("2025-04-20");
        empEmily.setDesignation("Marketing Lead");
        empEmily.setPhone("+1 (800) 555-0102");
        empEmily = userRepository.save(empEmily);

        // 3. Create Sample Initial Tickets
        Ticket t1 = new Ticket();
        t1.setTitle("Wi-Fi disconnects frequently in Conference Room B");
        t1.setDescription("My laptop keeps dropping the office Wi-Fi network connection whenever I move to meeting room 2B.");
        t1.setCategory(Category.NETWORK);
        t1.setPriority(Priority.MEDIUM);
        t1.setStatus(Status.OPEN);
        t1.setSuggestedSolution("Restart Wi-Fi adapter, verify router signal in Room 2B, or check network connection.");
        t1.setEmployee(empJohn);
        ticketRepository.save(t1);

        Ticket t2 = new Ticket();
        t2.setTitle("Laptop screen remains black on startup");
        t2.setDescription("Pressing power button turns on keyboard backlight but monitor screen stays completely dark.");
        t2.setCategory(Category.HARDWARE);
        t2.setPriority(Priority.HIGH);
        t2.setStatus(Status.IN_PROGRESS);
        t2.setSuggestedSolution("Check power adapter cable, perform hard reset by holding power for 15s, or connect to external monitor.");
        t2.setEmployee(empEmily);
        t2.setAssignedTo(staffAlex);
        t2 = ticketRepository.save(t2);

        // Messages for Ticket 2
        messageRepository.save(new TicketMessage(t2, empEmily, "I tried holding the power button for 15 seconds, but the display is still blank."));
        messageRepository.save(new TicketMessage(t2, staffAlex, "Thanks Emily. I will bring an external HDMI monitor to your desk to test."));

        Ticket t3 = new Ticket();
        t3.setTitle("Forgot company intranet password");
        t3.setDescription("I got locked out of my corporate portal account after 3 failed login attempts.");
        t3.setCategory(Category.ACCESS);
        t3.setPriority(Priority.LOW);
        t3.setStatus(Status.RESOLVED);
        t3.setSuggestedSolution("Verify username, use self-service password reset, or contact domain administrator.");
        t3.setEmployee(empJohn);
        t3.setAssignedTo(staffSarah);
        t3 = ticketRepository.save(t3);

        Resolution res = new Resolution(t3, staffSarah, "User identity verified and account password reset link sent via corporate SMS.");
        resolutionRepository.save(res);

        System.out.println("✅ Helpdesk Data Initialized (Admin: " + adminEmail + ")");
    }
}
