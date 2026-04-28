/**
 * Get the color associated with a project status.
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return '#94a3b8';
    case 'ACTIVE': return '#6366f1';
    case 'IN PROGRESS': return '#3b82f6';
    case 'PENDING REVIEW': return '#f43f5e';
    case 'REVISION REQUESTED': return '#f59e0b';
    case 'COMPLETE':
    case 'BILLED': return '#10b981';
    case 'ARCHIVED': return '#64748b';
    default: return '#94a3b8';
  }
};

/**
 * Format a date string for display (e.g., Oct 24, 2026).
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Not Commenced';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
