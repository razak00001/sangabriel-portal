/**
 * Get the color associated with a project status.
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'DRAFT': return '#64748b';
    case 'ACTIVE': return '#4338ca';
    case 'IN PROGRESS': return '#2563eb';
    case 'PENDING REVIEW': return '#db2777';
    case 'REVISION REQUESTED': return '#d97706';
    case 'COMPLETE':
    case 'BILLED': return '#059669';
    case 'ARCHIVED': return '#475569';
    default: return '#64748b';
  }
};

/**
 * Format a date string for display.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  return new Date(dateString).toLocaleDateString();
};
