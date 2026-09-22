package com.helpdesk.service;

import com.helpdesk.ai.AIService;
import com.helpdesk.dto.*;
import com.helpdesk.model.*;
import com.helpdesk.repository.*;
import com.helpdesk.security.InputSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketMessageRepository messageRepository;
    private final ResolutionRepository resolutionRepository;
    private final AIService aiService;
    private final InputSanitizer inputSanitizer;

    @Autowired
    public TicketService(TicketRepository ticketRepository, UserRepository userRepository,
                         TicketMessageRepository messageRepository, ResolutionRepository resolutionRepository,
                         AIService aiService, InputSanitizer inputSanitizer) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.resolutionRepository = resolutionRepository;
        this.aiService = aiService;
        this.inputSanitizer = inputSanitizer;
    }

    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getAllTickets(Long employeeId) {
        List<Ticket> tickets;
        if (employeeId != null) {
            tickets = ticketRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
        } else {
            tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
        }
        return tickets.stream().map(TicketResponseDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<TicketResponseDTO> getTicketById(Long id) {
        return ticketRepository.findById(id).map(TicketResponseDTO::new);
    }

    @Transactional
    public TicketResponseDTO createTicket(TicketRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Problem title cannot be empty.");
        }
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Problem description cannot be empty.");
        }

        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee user not found with ID: " + request.getEmployeeId()));

        String sanitizedTitle = inputSanitizer.sanitizeText(request.getTitle());
        String sanitizedDesc = inputSanitizer.sanitizeText(request.getDescription());

        Ticket ticket = new Ticket();
        ticket.setTitle(sanitizedTitle);
        ticket.setDescription(sanitizedDesc);
        ticket.setEmployee(employee);

        // Run AI classification if not explicitly provided
        if (request.getCategory() != null && request.getPriority() != null) {
            ticket.setCategory(request.getCategory());
            ticket.setPriority(request.getPriority());
            ticket.setSuggestedSolution(inputSanitizer.sanitizeText(request.getSuggestedSolution()));
        } else {
            AIAnalysisDTO aiResult = aiService.analyze(sanitizedDesc);
            ticket.setCategory(aiResult.getCategory());
            ticket.setPriority(aiResult.getPriority());
            ticket.setSuggestedSolution(aiResult.getSuggestedSolution());
        }

        if (request.getContactInfo() != null && !request.getContactInfo().trim().isEmpty()) {
            ticket.setContactInfo(inputSanitizer.sanitizeText(request.getContactInfo().trim()));
        }

        ticket.setStatus(Status.OPEN);
        Ticket saved = ticketRepository.save(ticket);
        return new TicketResponseDTO(saved);
    }

    @Transactional
    public TicketResponseDTO updateStatus(Long ticketId, Status status, Long staffId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));

        ticket.setStatus(status);

        if (staffId != null) {
            User staff = userRepository.findById(staffId).orElse(null);
            if (staff != null) {
                ticket.setAssignedTo(staff);
            }
        }

        Ticket updated = ticketRepository.save(ticket);
        return new TicketResponseDTO(updated);
    }

    @Transactional
    public TicketResponseDTO.MessageDTO addMessage(Long ticketId, MessageRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Message text cannot be empty.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender user not found with ID: " + request.getSenderId()));

        String sanitizedMsg = inputSanitizer.sanitizeText(request.getMessage());
        TicketMessage message = new TicketMessage(ticket, sender, sanitizedMsg);
        TicketMessage saved = messageRepository.save(message);
        return new TicketResponseDTO.MessageDTO(saved);
    }

    @Transactional
    public TicketResponseDTO resolveTicket(Long ticketId, ResolutionRequest request) {
        if (request.getResolution() == null || request.getResolution().trim().isEmpty()) {
            throw new IllegalArgumentException("Resolution description cannot be empty.");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));
        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Staff user not found with ID: " + request.getStaffId()));

        String sanitizedResolution = inputSanitizer.sanitizeText(request.getResolution());
        Resolution resolution = resolutionRepository.findByTicketId(ticketId).orElse(new Resolution());
        resolution.setTicket(ticket);
        resolution.setResolvedBy(staff);
        resolution.setResolutionText(sanitizedResolution);
        resolution.setResolvedAt(LocalDateTime.now());
        resolutionRepository.save(resolution);

        ticket.setStatus(Status.RESOLVED);
        ticket.setResolution(resolution);
        Ticket saved = ticketRepository.save(ticket);

        return new TicketResponseDTO(saved);
    }

    @Transactional
    public TicketResponseDTO rejectTicket(Long ticketId, Long staffId, String reason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));
        User staff = staffId != null ? userRepository.findById(staffId).orElse(null) : null;
        String staffName = staff != null ? staff.getName() : "IT Technician";

        // Re-routing ticket back to open triage pool
        ticket.setAssignedTo(null);
        ticket.setStatus(Status.OPEN);

        String sanitizedReason = reason != null && !reason.trim().isEmpty()
                ? inputSanitizer.sanitizeText(reason.trim())
                : "Re-routed back to Triage queue for alternative IT Technician assignment.";

        // Record system activity entry in ticket messages
        TicketMessage systemMsg = new TicketMessage(ticket, staff != null ? staff : ticket.getEmployee(),
                "⚠️ [IT Technician Action]: " + staffName + " declined / re-routed this incident. Note: " + sanitizedReason);
        messageRepository.save(systemMsg);

        Ticket saved = ticketRepository.save(ticket);
        return new TicketResponseDTO(saved);
    }
}
