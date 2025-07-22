/**
 * Utility functions for Farcaster integration
 */

/**
 * Generate Farcaster embed metadata for a page
 */
export function generateFarcasterEmbed({
  imageUrl,
  buttonTitle = 'Open LocalLift',
  targetUrl,
  appName = 'LocalLift',
  splashImageUrl = 'https://locallift.xyz/logo.png',
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