/** The current storefront is a browser-local prototype, not a secure commerce backend. */
export const isDemoMode = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
