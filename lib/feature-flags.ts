/**
 * Feature Flags Configuration
 * 
 * Central configuration for feature flags across the application.
 * This allows for controlled rollouts and easy rollback of features.
 */

export interface FeatureFlags {
  typography: {
    ufcFont: boolean;
  };
}

/**
 * Get feature flags configuration
 * Can be extended to read from environment variables, database, or feature flag service
 */
export const getFeatureFlags = (): FeatureFlags => {
  return {
    typography: {
      // Enable UFC font stack - set to true to activate
      ufcFont: process.env.NEXT_PUBLIC_ENABLE_UFC_FONT === 'true' || true,
    },
  };
};

/**
 * Hook to check if a specific feature is enabled
 */
export const useFeatureFlag = (flag: keyof FeatureFlags | string): boolean => {
  const flags = getFeatureFlags();
  
  // Support nested flag paths like 'typography.ufcFont'
  const parts = flag.split('.');
  let value: any = flags;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part as keyof typeof value];
    } else {
      return false;
    }
  }
  
  return Boolean(value);
};

/**
 * Server-side feature flag check
 */
export const isFeatureEnabled = (flag: string): boolean => {
  const flags = getFeatureFlags();
  const parts = flag.split('.');
  let value: any = flags;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part as keyof typeof value];
    } else {
      return false;
    }
  }
  
  return Boolean(value);
};

