/**
 * Umami Analytics Utilities
 * 
 * Provides easy-to-use functions for tracking custom events with Umami Analytics.
 * All functions are safe to call even if Umami is not loaded (won't throw errors).
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, any>) => void;
    };
  }
}

/**
 * Track a custom event with Umami Analytics
 * @param eventName - Name of the event to track
 * @param data - Optional additional data to send with the event
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.umami) {
    try {
      window.umami.track(eventName, data);
    } catch (error) {
      console.warn('Failed to track Umami event:', error);
    }
  }
}

/**
 * Track car selection form interactions
 */
export const trackCarSelection = {
  startForm: () => trackEvent('car-selection-started'),
  makeSelected: (make: string) => trackEvent('car-make-selected', { make }),
  modelSelected: (make: string, model: string) => trackEvent('car-model-selected', { make, model }),
  yearSelected: (year: string) => trackEvent('car-year-selected', { year }),
  formCompleted: (data: { make: string; model: string; year: string }) => 
    trackEvent('car-selection-completed', data),
};

/**
 * Track cost calculator usage
 */
export const trackCostCalculator = {
  calculate: (data: { make: string; model: string; price: number }) => 
    trackEvent('cost-calculation', data),
  saveEstimate: (data: { totalCost: number; currency: string }) => 
    trackEvent('cost-estimate-saved', data),
};

/**
 * Track OpenLane form interactions
 */
export const trackOpenLane = {
  linkSubmitted: (url: string) => trackEvent('openlane-link-submitted', { url }),
  formStarted: () => trackEvent('openlane-form-started'),
};

/**
 * Track authentication events
 */
export const trackAuth = {
  loginStarted: () => trackEvent('login-started'),
  loginCompleted: () => trackEvent('login-completed'),
  signupStarted: () => trackEvent('signup-started'),
  signupCompleted: () => trackEvent('signup-completed'),
  logout: () => trackEvent('logout'),
};

/**
 * Track user engagement events
 */
export const trackEngagement = {
  newsletterSignup: () => trackEvent('newsletter-signup'),
  contactForm: () => trackEvent('contact-form-submitted'),
  phoneCall: () => trackEvent('phone-call-clicked'),
  emailContact: () => trackEvent('email-contact-clicked'),
};

/**
 * Track car request events
 */
export const trackCarRequest = {
  submitted: (data: { budget?: number; urgency?: string }) => 
    trackEvent('car-request-submitted', data),
  memberRequestSubmitted: (data: { budget?: number; carType?: string }) => 
    trackEvent('member-car-request-submitted', data),
};