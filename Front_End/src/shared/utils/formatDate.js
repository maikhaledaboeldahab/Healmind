export const formatDate = (isoDate, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-US', options);
};

export const formatShortDate = (isoDate) =>
  formatDate(isoDate, { weekday: 'short', month: 'short', day: 'numeric' });
