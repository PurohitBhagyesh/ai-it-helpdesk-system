package com.helpdesk.service;

import com.helpdesk.ai.AIService;
import com.helpdesk.ai.KeywordClassifier;
import com.helpdesk.ai.SolutionAdvisor;
import com.helpdesk.dto.TicketRequest;
import com.helpdesk.dto.TicketResponseDTO;
import com.helpdesk.model.*;
import com.helpdesk.repository.*;
import com.helpdesk.security.InputSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
public class TicketServiceTest {

    private TicketRepository ticketRepository;
    private UserRepository userRepository;
    private TicketMessageRepository messageRepository;
    private ResolutionRepository resolutionRepository;
    private AIService aiService;
    private InputSanitizer inputSanitizer;
    private TicketService ticketService;

    @BeforeEach
    public void setUp() {
        ticketRepository = mock(TicketRepository.class);
        userRepository = mock(UserRepository.class);
        messageRepository = mock(TicketMessageRepository.class);
        resolutionRepository = mock(ResolutionRepository.class);
        aiService = new AIService(new KeywordClassifier(), new SolutionAdvisor());
        inputSanitizer = new InputSanitizer();

        ticketService = new TicketService(
                ticketRepository,
                userRepository,
                messageRepository,
                resolutionRepository,
                aiService,
                inputSanitizer
        );
    }

    @Test
    public void testCreateTicketWithContactInfo() {
        User emp = new User("Jane Doe", "jane@company.com", "hash", Role.EMPLOYEE, "Finance");
        emp.setId(5L);
        when(userRepository.findById(5L)).thenReturn(Optional.of(emp));

        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> {
            Ticket t = invocation.getArgument(0);
            t.setId(101L);
            return t;
        });

        TicketRequest req = new TicketRequest();
        req.setEmployeeId(5L);
        req.setTitle("VPN Gateway Timeout");
        req.setDescription("Cannot connect to intranet server with WiFi.");
        req.setContactInfo("Floor 3, Desk 301 - Ext: 3301");

        TicketResponseDTO res = ticketService.createTicket(req);
        assertNotNull(res);
        assertEquals(101L, res.getId());
        assertEquals("Floor 3, Desk 301 - Ext: 3301", res.getContactInfo());
        assertEquals(Status.OPEN, res.getStatus());
        assertEquals(Category.NETWORK, res.getCategory());
    }

    @Test
    public void testUpdateStatusToInProgress() {
        User staff = new User("Alex Tech", "alex@company.com", "hash", Role.IT_STAFF, "IT Tier-1");
        staff.setId(2L);

        User emp = new User("Jane Doe", "jane@company.com", "hash", Role.EMPLOYEE, "Finance");
        emp.setId(5L);

        Ticket ticket = new Ticket();
        ticket.setId(200L);
        ticket.setTitle("Printer jam");
        ticket.setDescription("Printer offline");
        ticket.setCategory(Category.HARDWARE);
        ticket.setPriority(Priority.LOW);
        ticket.setEmployee(emp);
        ticket.setStatus(Status.OPEN);

        when(ticketRepository.findById(200L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArgument(0));

        TicketResponseDTO res = ticketService.updateStatus(200L, Status.IN_PROGRESS, 2L);
        assertNotNull(res);
        assertEquals(Status.IN_PROGRESS, res.getStatus());
        assertEquals(2L, res.getAssignedTo());
        assertEquals("Alex Tech", res.getAssignedName());
    }

    @Test
    public void testRejectTicketReturnsToOpen() {
        User staff = new User("Alex Tech", "alex@company.com", "hash", Role.IT_STAFF, "IT Tier-1");
        staff.setId(2L);

        User emp = new User("Jane Doe", "jane@company.com", "hash", Role.EMPLOYEE, "Finance");
        emp.setId(5L);

        Ticket ticket = new Ticket();
        ticket.setId(200L);
        ticket.setTitle("Printer jam");
        ticket.setDescription("Printer offline");
        ticket.setCategory(Category.HARDWARE);
        ticket.setPriority(Priority.LOW);
        ticket.setEmployee(emp);
        ticket.setAssignedTo(staff);
        ticket.setStatus(Status.IN_PROGRESS);

        when(ticketRepository.findById(200L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArgument(0));

        TicketResponseDTO res = ticketService.rejectTicket(200L, 2L, "Requires hardware replacement from Tier-2 vendor.");
        assertNotNull(res);
        assertEquals(Status.OPEN, res.getStatus());
        assertNull(res.getAssignedTo());
    }
}
