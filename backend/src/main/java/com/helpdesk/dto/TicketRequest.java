package com.helpdesk.dto;

import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;

public class TicketRequest {
    private String title;
    private String description;
    private Category category;
    private Priority priority;
    private String suggestedSolution;
    private String contactInfo;
    private Long employeeId;

    public TicketRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getSuggestedSolution() { return suggestedSolution; }
    public void setSuggestedSolution(String suggestedSolution) { this.suggestedSolution = suggestedSolution; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
}
