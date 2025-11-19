import mixpanel from 'mixpanel-browser'

/**
 * Mixpanel Analytics Singleton Service
 *
 * Provides a centralized way to track events across the application.
 * Uses singleton pattern to ensure mixpanel is only initialized once.
 */
class MixpanelTracking {
  private static _instance: MixpanelTracking | null = null

  private constructor() {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

    if (!token) {
      console.warn('Mixpanel: NEXT_PUBLIC_MIXPANEL_TOKEN is not set')
      return
    }

    // Initialize Mixpanel
    mixpanel.init(token, {
      debug: true,
      track_pageview: true,
      persistence: 'localStorage',
      ignore_dnt: true, // Important: ignore Do Not Track to ensure tracking works
      api_host: 'https://api-eu.mixpanel.com',
    })

    console.log('Mixpanel initialized with token:', token)
  }

  public static getInstance(): MixpanelTracking {
    if (!MixpanelTracking._instance) {
      MixpanelTracking._instance = new MixpanelTracking()
    }
    return MixpanelTracking._instance
  }

  /**
   * Track a generic event
   */
  protected track(name: string, data: Record<string, any> = {}): void {
    mixpanel.track(name, data)
  }

  /**
   * Track page view
   */
  public pageViewed(): void {
    this.track('Page View', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    })
  }

  /**
   * Identify a user
   */
  public identify(userId: string): void {
    mixpanel.identify(userId)
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: Record<string, any>): void {
    mixpanel.people.set(properties)
  }

  /**
   * Track custom event with properties
   */
  public trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.track(eventName, properties)
  }
}

// Export singleton instance getter
export const Mixpanel = MixpanelTracking.getInstance()
