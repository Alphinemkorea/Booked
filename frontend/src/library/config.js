/**
 * Backend base URL (Render or local).
 * Example: https://booked-api.onrender.com
 * Leave empty to use Vite proxy (/api → localhost) or seed fallback.
 */
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** True when a remote API base is configured */
export const HAS_API = Boolean(API_URL);

/** Prefer live API over local JSON seed when HAS_API is true */
export const USE_SEED_FALLBACK = import.meta.env.VITE_USE_SEED_FALLBACK !== '0';
