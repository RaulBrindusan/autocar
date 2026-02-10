import mixpanel from 'mixpanel-browser'

// Global flag to prevent multiple initializations across hot reloads
declare global {
  interface Window {
    __MIXPANEL_INITIALIZED__?: boolean
  }
}

/**
 * Mixpanel Analytics Singleton Service
 *
 * Provides a centralized way to track events across the application.
 * Uses singleton pattern to ensure mixpanel is only initialized once.
 * Includes guards to prevent multiple initializations during hot module reloading.
 */
class MixpanelTracking {
  private static _instance: MixpanelTracking | null = null
  private isInitialized: boolean = false

  private constructor() {
    // Only run in browser
    if (typeof window === 'undefined') {
      this.isInitialized = false
      return
    }

    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

    if (!token) {
      console.warn('Mixpanel: NEXT_PUBLIC_MIXPANEL_TOKEN is not set')
      this.isInitialized = false
      return
    }

    // Check if Mixpanel is already initialized globally (prevents hot reload issues)
    if (window.__MIXPANEL_INITIALIZED__) {
      console.log('Mixpanel: Already initialized, skipping re-initialization')
      this.isInitialized = true
      return
    }

    // Check if Mixpanel SDK is already initialized
    try {
      const existingId = mixpanel.get_distinct_id()
      if (existingId && existingId !== '') {
        console.log('Mixpanel: SDK already initialized, reusing existing instance')
        this.isInitialized = true
        window.__MIXPANEL_INITIALIZED__ = true
        return
      }
    } catch (e) {
      // get_distinct_id() throws if not initialized, which is fine
    }

    try {
      console.log('Mixpanel: Initializing for the first time')

      // Initialize Mixpanel with browser SDK configuration
      mixpanel.init(token, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: 'url-with-path', // Track page views automatically
        persistence: 'localStorage',
        ignore_dnt: true, // Ignore Do Not Track
        api_host: 'https://api-eu.mixpanel.com', // EU data residency
        disable_persistence: false,
        // Enable autocapture with all features
        autocapture: {
          pageview: 'full-url',
          click: true,
          input: true,
          scroll: true,
          submit: true,
        },
        // Enable session replay
        record_sessions_percent: 100,
      })

      this.isInitialized = true
      window.__MIXPANEL_INITIALIZED__ = true

      // Register super properties that will be sent with every event
      this.registerSuperProperties()

      // Identify anonymous users to enable user profiles
      const deviceId = mixpanel.get_distinct_id()
      if (deviceId) {
        mixpanel.identify(deviceId)
        // Set initial user profile properties
        mixpanel.people.set_once({
          '$created': new Date().toISOString(),
          'First Visit': new Date().toISOString(),
        })
      }

      console.log('Mixpanel initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error)
      this.isInitialized = false
      window.__MIXPANEL_INITIALIZED__ = false
    }
  }

  /**
   * Register super properties that will be sent with every event
   */
  private registerSuperProperties(): void {
    if (!this.isInitialized || typeof window === 'undefined') return

    try {
      const superProps: Record<string, string | number | boolean> = {
        'App Version': '1.0.0',
        'Platform': 'Web',
        'Site': 'automode.ro',
      }

      // Add screen resolution
      if (window.screen) {
        superProps['Screen Width'] = window.screen.width
        superProps['Screen Height'] = window.screen.height
        superProps['Screen Resolution'] = `${window.screen.width}x${window.screen.height}`
      }

      // Add viewport size
      superProps['Viewport Width'] = window.innerWidth
      superProps['Viewport Height'] = window.innerHeight

      // Add timezone
      superProps['Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone

      // Add language
      superProps['Browser Language'] = navigator.language

      // Check if mobile
      superProps['Is Mobile'] = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      mixpanel.register(superProps)
    } catch (error) {
      console.error('Failed to register super properties:', error)
    }
  }

  public static getInstance(): MixpanelTracking {
    if (!MixpanelTracking._instance) {
      MixpanelTracking._instance = new MixpanelTracking()
    }
    return MixpanelTracking._instance
  }

  /**
   * Check if Mixpanel is initialized
   */
  public isReady(): boolean {
    return this.isInitialized
  }

  /**
   * Track a generic event
   */
  protected track(name: string, data: Record<string, unknown> = {}): void {
    if (!this.isInitialized) {
      return
    }
    try {
      mixpanel.track(name, data)
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  /**
   * Track page view with full context
   */
  public trackPageView(path?: string): void {
    if (!this.isInitialized || typeof window === 'undefined') return

    try {
      const currentPath = path || window.location.pathname
      const fullUrl = window.location.href
      const referrer = document.referrer

      this.track('Page View', {
        page: currentPath,
        path: currentPath,
        url: fullUrl,
        title: document.title,
        referrer: referrer || 'direct',
        host: window.location.host,
        search: window.location.search,
        hash: window.location.hash,
        'Page Title': document.title,
        'Page Path': currentPath,
        'Page URL': fullUrl,
        'Referrer': referrer || 'direct',
      })

      // Increment page view count for the user
      mixpanel.people.increment('Total Page Views')
      mixpanel.people.set({
        'Last Page Viewed': currentPath,
        'Last Visit': new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  /**
   * Legacy method - now calls trackPageView
   */
  public pageViewed(): void {
    this.trackPageView()
  }

  /**
   * Identify a user (call when user logs in)
   */
  public identify(userId: string, userProps?: Record<string, unknown>): void {
    if (!this.isInitialized) return

    try {
      mixpanel.identify(userId)

      if (userProps) {
        mixpanel.people.set(userProps)
      }
    } catch (error) {
      console.error('Failed to identify user:', error)
    }
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: Record<string, unknown>): void {
    if (!this.isInitialized) return
    try {
      mixpanel.people.set(properties)
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }

  /**
   * Set user properties once (only if not already set)
   */
  public setUserPropertiesOnce(properties: Record<string, unknown>): void {
    if (!this.isInitialized) return
    try {
      mixpanel.people.set_once(properties)
    } catch (error) {
      console.error('Failed to set user properties once:', error)
    }
  }

  /**
   * Increment a numeric user property
   */
  public incrementUserProperty(property: string, value: number = 1): void {
    if (!this.isInitialized) return
    try {
      mixpanel.people.increment(property, value)
    } catch (error) {
      console.error('Failed to increment user property:', error)
    }
  }

  /**
   * Track custom event with properties
   */
  public trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.isInitialized) return
    this.track(eventName, properties || {})
  }

  /**
   * Track button click
   */
  public trackClick(buttonName: string, properties?: Record<string, unknown>): void {
    this.track('Button Clicked', {
      'Button Name': buttonName,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      ...properties,
    })
  }

  /**
   * Track form submission
   */
  public trackFormSubmit(formName: string, properties?: Record<string, unknown>): void {
    this.track('Form Submitted', {
      'Form Name': formName,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      ...properties,
    })
  }

  /**
   * Track signup
   */
  public trackSignup(method: string, properties?: Record<string, unknown>): void {
    this.track('Sign Up', {
      'Signup Method': method,
      ...properties,
    })
    try {
      mixpanel.people.set_once({
        'Signup Date': new Date().toISOString(),
        'Signup Method': method,
      })
    } catch (error) {
      console.error('Failed to track signup:', error)
    }
  }

  /**
   * Track login
   */
  public trackLogin(method: string, properties?: Record<string, unknown>): void {
    this.track('Login', {
      'Login Method': method,
      ...properties,
    })
    try {
      mixpanel.people.set({
        'Last Login': new Date().toISOString(),
      })
      mixpanel.people.increment('Login Count')
    } catch (error) {
      console.error('Failed to track login:', error)
    }
  }

  /**
   * Reset user (call on logout)
   */
  public reset(): void {
    if (!this.isInitialized) return
    try {
      mixpanel.reset()
    } catch (error) {
      console.error('Failed to reset Mixpanel:', error)
    }
  }

  /**
   * Time an event (call at start, then trackEvent at end)
   */
  public timeEvent(eventName: string): void {
    if (!this.isInitialized) return
    try {
      mixpanel.time_event(eventName)
    } catch (error) {
      console.error('Failed to time event:', error)
    }
  }

  /**
   * Get the raw mixpanel instance for advanced use cases
   */
  public getRawMixpanel(): typeof mixpanel | null {
    if (!this.isInitialized) return null
    return mixpanel
  }
}

// Export singleton instance getter
export const Mixpanel = MixpanelTracking.getInstance()

// Also export the class for testing purposes
export { MixpanelTracking }
