package com.helpdesk.service;

import com.helpdesk.dto.EnquiryRequest;
import com.helpdesk.model.Enquiry;
import com.helpdesk.repository.EnquiryRepository;
import com.helpdesk.security.InputSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final InputSanitizer inputSanitizer;

    @Autowired
    public EnquiryService(EnquiryRepository enquiryRepository, InputSanitizer inputSanitizer) {
        this.enquiryRepository = enquiryRepository;
        this.inputSanitizer = inputSanitizer;
    }

    @Transactional(readOnly = true)
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Enquiry submitEnquiry(EnquiryRequest request) {
        if (request.getSubject() == null || request.getSubject().trim().isEmpty()) {
            throw new IllegalArgumentException("Enquiry subject cannot be empty.");
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Enquiry message cannot be empty.");
        }

        String sanitizedSender = inputSanitizer.sanitizeText(request.getSenderName() != null ? request.getSenderName() : "Anonymous User");
        String sanitizedEmail = inputSanitizer.sanitizeText(request.getSenderEmail() != null ? request.getSenderEmail() : "unknown@helpdesk.corp");
        String sanitizedRole = inputSanitizer.sanitizeText(request.getSenderRole() != null ? request.getSenderRole() : "EMPLOYEE");
        String sanitizedCode = request.getEmployeeIdCode() != null ? inputSanitizer.sanitizeText(request.getEmployeeIdCode().trim()) : "";
        String sanitizedSubject = inputSanitizer.sanitizeText(request.getSubject());
        String sanitizedMessage = inputSanitizer.sanitizeText(request.getMessage());

        Enquiry enquiry = new Enquiry(
                request.getSenderId() != null ? request.getSenderId() : 0L,
                sanitizedSender,
                sanitizedEmail,
                sanitizedRole,
                sanitizedSubject,
                sanitizedMessage
        );
        enquiry.setEmployeeIdCode(sanitizedCode);

        // Simulation of corporate email notification to the Admin mailbox
        System.out.println("📧 [ADMIN MAIL DISPATCH]: New enquiry received from " + sanitizedSender + " (" + sanitizedEmail + ", ID: " + sanitizedCode + ") - Subject: " + sanitizedSubject);

        return enquiryRepository.save(enquiry);
    }

    @Transactional
    public boolean updateStatus(Long enquiryId, String status) {
        Optional<Enquiry> opt = enquiryRepository.findById(enquiryId);
        if (opt.isPresent()) {
            Enquiry enquiry = opt.get();
            enquiry.setStatus(status != null ? status.toUpperCase() : "RESOLVED");
            enquiryRepository.save(enquiry);
            return true;
        }
        return false;
    }
}
