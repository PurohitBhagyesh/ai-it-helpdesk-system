package com.helpdesk.controller;

import com.helpdesk.ai.AIService;
import com.helpdesk.dto.*;
import com.helpdesk.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final AIService aiService;

    @Autowired
    public TicketController(TicketService ticketService, AIService aiService) {
        this.ticketService = ticketService;
        this.aiService = aiService;
    }

    // 1. Get all tickets (or filter by employeeId)
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets(@RequestParam(required = false) Long employeeId) {
        return ResponseEntity.ok(ticketService.getAllTickets(employeeId));
    }

    // 2. Get single ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Real-time AI analysis endpoint
    @PostMapping("/analyze")
    public ResponseEntity<AIAnalysisDTO> analyzeProblem(@RequestBody Map<String, String> payload) {
        String description = payload.getOrDefault("description", "");
        AIAnalysisDTO result = aiService.analyze(description);
        return ResponseEntity.ok(result);
    }

    // 4. Create new ticket
    @PostMapping
    public ResponseEntity<TicketResponseDTO> createTicket(@RequestBody TicketRequest request) {
        TicketResponseDTO created = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 5. Update ticket status / assign staff
    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        TicketResponseDTO updated = ticketService.updateStatus(id, request.getStatus(), request.getStaffId());
        return ResponseEntity.ok(updated);
    }

    // 6. Post a message to ticket conversation
    @PostMapping("/{id}/messages")
    public ResponseEntity<TicketResponseDTO.MessageDTO> addMessage(@PathVariable Long id, @RequestBody MessageRequest request) {
        TicketResponseDTO.MessageDTO msg = ticketService.addMessage(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(msg);
    }

    // 7. Resolve ticket with final resolution note
    @PostMapping("/{id}/resolve")
    public ResponseEntity<TicketResponseDTO> resolveTicket(@PathVariable Long id, @RequestBody ResolutionRequest request) {
        TicketResponseDTO resolved = ticketService.resolveTicket(id, request);
        return ResponseEntity.ok(resolved);
    }
}
