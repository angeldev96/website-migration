/**
 * Helper function to get the correct API base path
 * In production, the app is mounted at root /
 * In development, it's at the root /
 */
export function getBasePath() {
  // Use the basePath from next.config.mjs
  return '';
}

/**
 * Helper function to create API URLs with the correct base path
 * @param {string} path - The API path (e.g., '/api/jobs')
 * @returns {string} - The complete API URL
 */
export function apiUrl(path) {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
