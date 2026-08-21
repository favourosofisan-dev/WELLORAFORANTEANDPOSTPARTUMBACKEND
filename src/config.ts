/**
 * Wellora Mama Frontend Configuration
 */

// In production, set VITE_API_BASE_URL in your env to point to your deployed backend.
// In development, leave it empty to use the Vite proxy.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
