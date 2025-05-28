/**
 * Environment utility functions
 * Helps with environment-specific configuration across the application
 */

/**
 * Returns the appropriate backend URL based on the current environment
 * Uses NEXT_PUBLIC_BACKEND_URL in production or falls back to localhost in development
 */
export const getBackendUrl = (): string => {
  // Use environment variable if available (production), otherwise default to localhost (development)
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
};
