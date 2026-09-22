package com.helpdesk.ai;

import com.helpdesk.dto.AIAnalysisDTO;
import com.helpdesk.model.Category;
import com.helpdesk.model.Priority;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AIServiceTest {

    private AIService aiService;

    @BeforeEach
    public void setUp() {
        KeywordClassifier classifier = new KeywordClassifier();
        SolutionAdvisor advisor = new SolutionAdvisor();
        aiService = new AIService(classifier, advisor);
    }

    @Test
    public void testNetworkProblemAnalysis() {
        AIAnalysisDTO result = aiService.analyze("My office Wi-Fi is constantly disconnecting from my laptop.");
        assertEquals(Category.NETWORK, result.getCategory());
        assertNotNull(result.getSuggestedSolution());
        assertTrue(result.getSuggestedSolution().contains("adapter") || result.getSuggestedSolution().contains("Wi-Fi"));
    }

    @Test
    public void testHardwareProblemAnalysis() {
        AIAnalysisDTO result = aiService.analyze("My monitor screen is completely black and won't turn on.");
        assertEquals(Category.HARDWARE, result.getCategory());
        assertNotNull(result.getSuggestedSolution());
    }

    @Test
    public void testSoftwareCrashAnalysis() {
        AIAnalysisDTO result = aiService.analyze("Google Chrome browser keeps crashing when opening company portal.");
        assertEquals(Category.SOFTWARE, result.getCategory());
        assertNotNull(result.getSuggestedSolution());
    }

    @Test
    public void testAccessPasswordAnalysis() {
        AIAnalysisDTO result = aiService.analyze("I forgot my password and got locked out of my corporate login account.");
        assertEquals(Category.ACCESS, result.getCategory());
        assertEquals(Priority.LOW, result.getPriority());
    }

    @Test
    public void testHighPriorityOutageAnalysis() {
        AIAnalysisDTO result = aiService.analyze("CRITICAL EMERGENCY: Company-wide server outage and production systems stopped.");
        assertEquals(Priority.HIGH, result.getPriority());
    }
}
