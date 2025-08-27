/**
 * Utility functions for Farcaster integration
 */

/**
 * Generate Farcaster embed metadata for a page
 */
export function generateFarcasterEmbed({
  imageUrl,
  buttonTitle = 'Open Swipevest',
  targetUrl,
  appName = 'Swipevest',
  splashImageUrl = 'https://swipevest.xyz/logo.png',
  splashBackgroundColor = '#0f172a'
}: {
  imageUrl: string;
  buttonTitle?: string;
  targetUrl?: string;
  appName?: string;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
}) {
  const embed = {
    version: "1",
    imageUrl,
    button: {
      title: buttonTitle,
      action: {
        type: "launch_miniapp",
        name: appName,
        url: targetUrl, // If not provided, defaults to current URL
        splashImageUrl,
        splashBackgroundColor
      }
    }
  };

  return {
    "fc:miniapp": JSON.stringify(embed),
    // For backward compatibility
    "fc:frame": JSON.stringify({
      ...embed,
      button: {
        ...embed.button,
        action: {
          ...embed.button.action,
          type: "launch_frame"
        }
      }
    })
  };
}

/**
 * Check if the current environment is a Farcaster Mini App
 * This is a client-side function
 */
export async function isInFarcasterMiniApp(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // Dynamically import the SDK to avoid server-side issues
    const { sdk } = await import('@farcaster/miniapp-sdk');
    return await sdk.isInMiniApp();
  } catch (error) {
    console.error('Error checking Farcaster environment:', error);
    return false;
  }
}

/**
 * Initialize Farcaster Mini App and hide splash screen
 * This should be called when the app is ready to display
 */
export async function initializeFarcasterApp(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Check if we're in a Farcaster Mini App
    const isInMiniApp = await isInFarcasterMiniApp();
    
    if (isInMiniApp) {
      // Dynamically import the SDK to avoid server-side issues
      const { sdk } = await import('@farcaster/miniapp-sdk');
      
      // Call ready() to hide the splash screen and display the app
      await sdk.actions.ready();
      
      console.log('Farcaster Mini App initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing Farcaster Mini App:', error);
  }
}

/**
 * @deprecated Use initializeFarcasterApp() instead
 * Remove splash screen after a few seconds for Farcaster miniapp
 * This should be called when the app is ready
 */
export function removeSplashScreen(timeoutMs: number = 3000): void {
  console.warn('removeSplashScreen is deprecated. Use initializeFarcasterApp() instead.');
  
  if (typeof window === 'undefined') return;
  
  // For backward compatibility, call the new function
  initializeFarcasterApp();
}