package com.helpdesk.service;

import com.helpdesk.dto.AdminStatsDTO;
import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;
import com.helpdesk.model.Status;
import com.helpdesk.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final TicketRepository ticketRepository;

    @Autowired
    public AdminService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public AdminStatsDTO getSystemStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(Status.OPEN);
        long inProgress = ticketRepository.countByStatus(Status.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(Status.RESOLVED) + ticketRepository.countByStatus(Status.CLOSED);

        Map<String, Long> categories = new HashMap<>();
        for (Category cat : Category.values()) {
            if (cat != Category.OTHER) {
                categories.put(cat.name(), ticketRepository.countByCategory(cat));
            }
        }

        Map<String, Long> priorities = new HashMap<>();
        for (Priority prio : Priority.values()) {
            priorities.put(prio.name(), ticketRepository.countByPriority(prio));
        }

        return new AdminStatsDTO(total, open, inProgress, resolved, categories, priorities);
    }
}
