package com.helpdesk.dto;

public class ResolutionRequest {
    private Long staffId;
    private String resolution;

    public ResolutionRequest() {}

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
}
