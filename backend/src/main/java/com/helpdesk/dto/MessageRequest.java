package com.helpdesk.dto;

public class MessageRequest {
    private Long senderId;
    private String message;

    public MessageRequest() {}

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
