package com.helpdesk.service;

import com.helpdesk.ai.AIService;
import com.helpdesk.dto.*;
import com.helpdesk.model.*;
import com.helpdesk.repository.*;
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

    @Autowired
    public TicketService(TicketRepository ticketRepository, UserRepository userRepository,
                         TicketMessageRepository messageRepository, ResolutionRepository resolutionRepository,
                         AIService aiService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.resolutionRepository = resolutionRepository;
        this.aiService = aiService;
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
        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee user not found with ID: " + request.getEmployeeId()));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setEmployee(employee);

        // Run AI classification if not explicitly provided
        if (request.getCategory() != null && request.getPriority() != null) {
            ticket.setCategory(request.getCategory());
            ticket.setPriority(request.getPriority());
            ticket.setSuggestedSolution(request.getSuggestedSolution());
        } else {
            AIAnalysisDTO aiResult = aiService.analyze(request.getDescription());
            ticket.setCategory(aiResult.getCategory());
            ticket.setPriority(aiResult.getPriority());
            ticket.setSuggestedSolution(aiResult.getSuggestedSolution());
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
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender user not found with ID: " + request.getSenderId()));

        TicketMessage message = new TicketMessage(ticket, sender, request.getMessage());
        TicketMessage saved = messageRepository.save(message);
        return new TicketResponseDTO.MessageDTO(saved);
    }

    @Transactional
    public TicketResponseDTO resolveTicket(Long ticketId, ResolutionRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ID: " + ticketId));
        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Staff user not found with ID: " + request.getStaffId()));

        Resolution resolution = resolutionRepository.findByTicketId(ticketId).orElse(new Resolution());
        resolution.setTicket(ticket);
        resolution.setResolvedBy(staff);
        resolution.setResolutionText(request.getResolution());
        resolution.setResolvedAt(LocalDateTime.now());
        resolutionRepository.save(resolution);

        ticket.setStatus(Status.RESOLVED);
        ticket.setResolution(resolution);
        Ticket saved = ticketRepository.save(ticket);

        return new TicketResponseDTO(saved);
    }
}
