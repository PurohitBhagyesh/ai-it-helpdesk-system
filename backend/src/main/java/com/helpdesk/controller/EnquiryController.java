package com.helpdesk.controller;

import com.helpdesk.dto.EnquiryRequest;
import com.helpdesk.model.Enquiry;
import com.helpdesk.service.EnquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    @Autowired
    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @GetMapping
    public ResponseEntity<List<Enquiry>> getAllEnquiries() {
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    @PostMapping
    public ResponseEntity<Enquiry> submitEnquiry(@RequestBody EnquiryRequest request) {
        Enquiry saved = enquiryService.submitEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "RESOLVED");
        boolean updated = enquiryService.updateStatus(id, status);
        if (updated) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Enquiry status updated to " + status));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Enquiry not found"));
    }
}
