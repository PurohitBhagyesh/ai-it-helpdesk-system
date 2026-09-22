package com.helpdesk.dto;

public class EnquiryRequest {
    private Long senderId;
    private String senderName;
    private String senderEmail;
    private String senderRole;
    private String subject;
    private String message;

    public EnquiryRequest() {}

    public EnquiryRequest(Long senderId, String senderName, String senderEmail, String senderRole, String subject, String message) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderRole = senderRole;
        this.subject = subject;
        this.message = message;
    }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
