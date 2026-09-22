package com.helpdesk.controller;

import com.helpdesk.dto.EnterpriseRegisterRequest;
import com.helpdesk.dto.EnterpriseResponse;
import com.helpdesk.dto.EnterpriseVerifyRequest;
import com.helpdesk.dto.OnboardingProvisionRequest;
import com.helpdesk.service.EnterpriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enterprise")
public class EnterpriseController {

    private final EnterpriseService enterpriseService;

    @Autowired
    public EnterpriseController(EnterpriseService enterpriseService) {
        this.enterpriseService = enterpriseService;
    }

    @PostMapping("/register")
    public ResponseEntity<EnterpriseResponse> registerEnterprise(@RequestBody EnterpriseRegisterRequest request) {
        EnterpriseResponse response = enterpriseService.registerEnterprise(request);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<EnterpriseResponse> verifyEnterprise(@RequestBody EnterpriseVerifyRequest request) {
        EnterpriseResponse response = enterpriseService.verifyEnterprise(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/provision-initial-team")
    public ResponseEntity<EnterpriseResponse> provisionInitialTeam(@RequestBody OnboardingProvisionRequest request) {
        EnterpriseResponse response = enterpriseService.provisionInitialTeam(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
