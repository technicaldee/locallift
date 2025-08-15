'use client';

// Analytics utility for tracking user interactions
export class Analytics {
  private static isProduction = process.env.NODE_ENV === 'production';
  
  static track(event: string, properties?: Record<string, any>) {
    if (!this.isProduction) {
      console.log('Analytics Event:', event, properties);
      return;
    }

    try {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, {
          ...properties,
          timestamp: Date.now(),
        });
      }

      // Firebase Analytics
      if (typeof window !== 'undefined' && (window as any).firebase) {
        // Add Firebase Analytics tracking here
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  static trackPageView(path: string) {
    this.track('page_view', {
      page_path: path,
      page_title: document.title,
    });
  }

  static trackInvestment(businessId: string, amount: number) {
    this.track('investment_made', {
      business_id: businessId,
      amount,
      currency: 'cUSD',
    });
  }

  static trackSwipe(direction: 'left' | 'right', businessId: string) {
    this.track('business_swipe', {
      direction,
      business_id: businessId,
    });
  }

  static trackWalletConnection(method: string) {
    this.track('wallet_connected', {
      connection_method: method,
    });
  }

  static trackBusinessRegistration(businessId: string) {
    this.track('business_registered', {
      business_id: businessId,
    });
  }

  static trackError(error: string, context?: string) {
    this.track('error_occurred', {
      error_message: error,
      error_context: context,
    });
  }
}