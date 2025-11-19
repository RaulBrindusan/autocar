import mixpanel from 'mixpanel-browser'

/**
 * Mixpanel Analytics Singleton Service
 *
 * Provides a centralized way to track events across the application.
 * Uses singleton pattern to ensure mixpanel is only initialized once.
 */
class MixpanelTracking {
  private static _instance: MixpanelTracking | null = null
  private isInitialized: boolean = false

  private constructor() {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

    if (!token) {
      console.warn('Mixpanel: NEXT_PUBLIC_MIXPANEL_TOKEN is not set')
      this.isInitialized = false
      return
    }

    // Initialize Mixpanel
    mixpanel.init(token, {
      debug: true,
      track_pageview: true,
      persistence: 'localStorage',
      ignore_dnt: true, // Important: ignore Do Not Track to ensure tracking works
      api_host: 'https://api-eu.mixpanel.com',
      // Enable autocapture
      autocapture: true,
      // Enable session replay
      record_sessions_percent: 100,
    })

    this.isInitialized = true
    console.log('Mixpanel initialized with token:', token)

    // Identify anonymous users immediately to enable user profiles
    const deviceId = mixpanel.get_distinct_id()
    if (deviceId) {
      mixpanel.identify(deviceId)
    }
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
    if (!this.isInitialized) {
      console.warn('Mixpanel: Not initialized, skipping track call')
      return
    }
    mixpanel.track(name, data)
  }

  /**
   * Track page view
   */
  public pageViewed(): void {
    if (!this.isInitialized) return

    this.track('Page View', {
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    })
  }

  /**
   * Identify a user
   */
  public identify(userId: string): void {
    if (!this.isInitialized) return
    mixpanel.identify(userId)
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized) return
    mixpanel.people.set(properties)
  }

  /**
   * Track custom event with properties
   */
  public trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) return
    this.track(eventName, properties)
  }
}

// Export singleton instance getter
export const Mixpanel = MixpanelTracking.getInstance()
