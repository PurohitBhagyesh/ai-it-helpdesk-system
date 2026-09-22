package com.helpdesk.ai;

import com.helpdesk.dto.AIAnalysisDTO;
import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final KeywordClassifier classifier;
    private final SolutionAdvisor advisor;

    @Autowired
    public AIService(KeywordClassifier classifier, SolutionAdvisor advisor) {
        this.classifier = classifier;
        this.advisor = advisor;
    }

    public AIAnalysisDTO analyze(String description) {
        Category category = classifier.classifyCategory(description);
        Priority priority = classifier.recommendPriority(description, category);
        String solution = advisor.suggestSolution(category, description);

        AIAnalysisDTO dto = new AIAnalysisDTO(category, priority, solution);
        dto.setDescription(description);
        return dto;
    }
}
