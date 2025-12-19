/**
 * Maps gender category values to more descriptive, non-sexist labels.
 * 
 * @param {string} category - The original gender category from the database
 * @returns {string} - The mapped label
 */
export function formatGenderCategory(category) {
  if (!category) return '';
  
  const lower = category.toLowerCase().trim();
  
  switch (lower) {
    case 'male':
    case 'non-graduate':
      return 'Non-Graduate';
    case 'female':
    case 'graduate':
      return 'Graduate';
    case 'both':
    case 'graduate & non-graduate':
      return 'Graduate & Non-Graduate';
    default:
      return category;
  }
}
