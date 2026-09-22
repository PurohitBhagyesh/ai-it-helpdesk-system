package com.helpdesk.dto;

import java.util.Map;

public class AdminStatsDTO {
    private long total;
    private long open;
    private long inProgress;
    private long resolved;
    private Map<String, Long> categories;
    private Map<String, Long> priorities;

    public AdminStatsDTO() {}

    public AdminStatsDTO(long total, long open, long inProgress, long resolved, 
                         Map<String, Long> categories, Map<String, Long> priorities) {
        this.total = total;
        this.open = open;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.categories = categories;
        this.priorities = priorities;
    }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public long getOpen() { return open; }
    public void setOpen(long open) { this.open = open; }

    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }

    public long getResolved() { return resolved; }
    public void setResolved(long resolved) { this.resolved = resolved; }

    public Map<String, Long> getCategories() { return categories; }
    public void setCategories(Map<String, Long> categories) { this.categories = categories; }

    public Map<String, Long> getPriorities() { return priorities; }
    public void setPriorities(Map<String, Long> priorities) { this.priorities = priorities; }
}
