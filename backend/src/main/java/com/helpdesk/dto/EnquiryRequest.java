package com.helpdesk.dto;

public class EnquiryRequest {
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private String senderRole;
    private String employeeIdCode;
    private String subject;
    private String message;

    public EnquiryRequest() {}

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getEmployeeIdCode() { return employeeIdCode; }
    public void setEmployeeIdCode(String employeeIdCode) { this.employeeIdCode = employeeIdCode; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
