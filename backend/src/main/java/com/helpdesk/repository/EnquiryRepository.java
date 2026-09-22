package com.helpdesk.repository;

import com.helpdesk.model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findAllByOrderByCreatedAtDesc();
    List<Enquiry> findBySenderIdOrderByCreatedAtDesc(Long senderId);
}
