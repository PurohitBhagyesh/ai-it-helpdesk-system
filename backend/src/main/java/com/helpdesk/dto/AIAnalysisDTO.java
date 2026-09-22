package com.helpdesk.dto;

import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;

public class AIAnalysisDTO {
    private String description;
    private Category category;
    private Priority priority;
    private String suggestedSolution;

    public AIAnalysisDTO() {}

    public AIAnalysisDTO(Category category, Priority priority, String suggestedSolution) {
        this.category = category;
        this.priority = priority;
        this.suggestedSolution = suggestedSolution;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getSuggestedSolution() { return suggestedSolution; }
    public void setSuggestedSolution(String suggestedSolution) { this.suggestedSolution = suggestedSolution; }
}
