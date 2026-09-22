package com.helpdesk.dto;

import com.helpdesk.model.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class TicketResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Category category;
    private Priority priority;
    private Status status;
    private String suggestedSolution;
    private Long employeeId;
    private String employeeName;
    private Long assignedTo;
    private String assignedName;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MessageDTO> messages;

    public static class MessageDTO {
        private Long id;
        private Long senderId;
        private String senderName;
        private String message;
        private LocalDateTime createdAt;

        public MessageDTO() {}

        public MessageDTO(TicketMessage msg) {
            this.id = msg.getId();
            this.senderId = msg.getSender().getId();
            this.senderName = msg.getSender().getName();
            this.message = msg.getMessage();
            this.createdAt = msg.getCreatedAt();
        }

        public Long getId() { return id; }
        public Long getSenderId() { return senderId; }
        public String getSenderName() { return senderName; }
        public String getMessage() { return message; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    public TicketResponseDTO() {}

    public TicketResponseDTO(Ticket ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.description = ticket.getDescription();
        this.category = ticket.getCategory();
        this.priority = ticket.getPriority();
        this.status = ticket.getStatus();
        this.suggestedSolution = ticket.getSuggestedSolution();
        
        if (ticket.getEmployee() != null) {
            this.employeeId = ticket.getEmployee().getId();
            this.employeeName = ticket.getEmployee().getName();
        }
        
        if (ticket.getAssignedTo() != null) {
            this.assignedTo = ticket.getAssignedTo().getId();
            this.assignedName = ticket.getAssignedTo().getName();
        } else {
            this.assignedName = "Unassigned";
        }

        if (ticket.getResolution() != null) {
            this.resolution = ticket.getResolution().getResolutionText();
        }

        this.createdAt = ticket.getCreatedAt();
        this.updatedAt = ticket.getUpdatedAt();

        if (ticket.getMessages() != null) {
            this.messages = ticket.getMessages().stream()
                    .map(MessageDTO::new)
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Category getCategory() { return category; }
    public Priority getPriority() { return priority; }
    public Status getStatus() { return status; }
    public String getSuggestedSolution() { return suggestedSolution; }
    public Long getEmployeeId() { return employeeId; }
    public String getEmployeeName() { return employeeName; }
    public Long getAssignedTo() { return assignedTo; }
    public String getAssignedName() { return assignedName; }
    public String getResolution() { return resolution; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<MessageDTO> getMessages() { return messages; }
}
