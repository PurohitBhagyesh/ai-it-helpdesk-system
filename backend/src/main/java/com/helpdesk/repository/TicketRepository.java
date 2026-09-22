package com.helpdesk.repository;

import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;
import com.helpdesk.model.Status;
import com.helpdesk.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long staffId);
    List<Ticket> findByStatusOrderByCreatedAtDesc(Status status);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    
    long countByStatus(Status status);
    long countByCategory(Category category);
    long countByPriority(Priority priority);
}
