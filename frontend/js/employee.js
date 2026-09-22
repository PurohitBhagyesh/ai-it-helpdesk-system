/**
 * Employee Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['EMPLOYEE', 'ADMIN']);
  if (!user) return;

  const problemTitleInput = document.getElementById('problem-title');
  const problemDescInput = document.getElementById('problem-desc');
  const submitTicketForm = document.getElementById('create-ticket-form');
  const ticketsTableBody = document.getElementById('my-tickets-tbody');
  const emptyState = document.getElementById('empty-state');

  // AI Diagnostic Preview Elements
  const aiCategoryEl = document.getElementById('ai-category');
  const aiPriorityEl = document.getElementById('ai-priority');
  const aiSolutionEl = document.getElementById('ai-solution');

  // Stat Counters
  const totalCountEl = document.getElementById('stat-total');
  const openCountEl = document.getElementById('stat-open');
  const progressCountEl = document.getElementById('stat-progress');
  const resolvedCountEl = document.getElementById('stat-resolved');

  // Real-time AI preview as employee types description
  let typingTimer;
  problemDescInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    const text = problemDescInput.value.trim();

    if (text.length < 5) {
      aiCategoryEl.textContent = 'Analyzing...';
      aiPriorityEl.textContent = 'Auto';
      aiSolutionEl.textContent = 'Type a brief description of your technical issue to see instant AI troubleshooting advice.';
      return;
    }

    typingTimer = setTimeout(async () => {
      const analysis = await API.analyzeProblem(text);
      aiCategoryEl.textContent = analysis.category;
      aiPriorityEl.textContent = analysis.priority;
      aiSolutionEl.textContent = analysis.suggestedSolution;

      // Update badge styling
      aiPriorityEl.className = 'ai-tag ' + (analysis.priority === 'HIGH' ? 'priority-high' : analysis.priority === 'MEDIUM' ? 'priority-medium' : 'priority-low');
    }, 250);
  });

  // Load and render user tickets
  async function loadMyTickets() {
    const tickets = await API.getTickets({ employeeId: user.id });

    // Update Counters
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    totalCountEl.textContent = total;
    openCountEl.textContent = open;
    progressCountEl.textContent = inProgress;
    resolvedCountEl.textContent = resolved;

    if (tickets.length === 0) {
      ticketsTableBody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    ticketsTableBody.innerHTML = tickets.map(ticket => `
      <tr>
        <td><strong>#${ticket.id}</strong></td>
        <td>
          <a href="ticket-details.html?id=${ticket.id}" style="font-weight: 600; color: #fff;">
            ${escapeHtml(ticket.title)}
          </a>
        </td>
        <td><span class="ai-tag">${ticket.category}</span></td>
        <td>
          <span class="badge priority-${ticket.priority.toLowerCase()}">
            ${ticket.priority}
          </span>
        </td>
        <td>
          <span class="badge badge-${ticket.status.toLowerCase().replace('_', '')}">
            ${ticket.status.replace('_', ' ')}
          </span>
        </td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">
          ${new Date(ticket.createdAt).toLocaleDateString()}
        </td>
        <td>
          <a href="ticket-details.html?id=${ticket.id}" class="btn btn-outline btn-sm">
            View Details
          </a>
        </td>
      </tr>
    `).join('');
  }

  // Handle Form Submission
  submitTicketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = problemTitleInput.value.trim();
    const description = problemDescInput.value.trim();

    if (!title || !description) {
      alert('Please provide both a problem title and detailed description.');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting & Analyzing...';

    const newTicket = await API.createTicket({
      title,
      description,
      employeeId: user.id,
      employeeName: user.name
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Ticket';

    // Clear Form & Reset AI box
    submitTicketForm.reset();
    aiCategoryEl.textContent = 'Ready';
    aiPriorityEl.textContent = 'Auto';
    aiSolutionEl.textContent = 'Type a brief description of your technical issue to see instant AI troubleshooting advice.';

    alert(`Ticket #${newTicket.id} created successfully! Our IT team has been notified.`);
    await loadMyTickets();
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadMyTickets();
});
