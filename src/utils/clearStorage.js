// Utility to clear and reinitialize storage
export const clearAndReinitialize = () => {
  localStorage.removeItem('jobs_data');
  localStorage.removeItem('candidates_data');
  window.location.reload();
};
