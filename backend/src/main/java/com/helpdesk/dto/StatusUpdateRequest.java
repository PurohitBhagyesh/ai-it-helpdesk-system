package com.helpdesk.dto;

import com.helpdesk.model.Status;

public class StatusUpdateRequest {
    private Status status;
    private Long staffId;

    public StatusUpdateRequest() {}

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }
}
