export const THEME = {
  colors: {
    primary: '#006A4E',        // Premium Emerald Green
    primaryLight: '#E8F5E9',   // Very light mint green for chips/accents
    primaryDark: '#004D38',
    primaryBorder: '#A3D9C9',
    
    background: '#F9FAFB',     // Clean background
    surface: '#FFFFFF',        // Card white
    surfaceCard: '#FFFFFF',
    
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Status colors
    success: '#10B981',
    successBg: '#D1FAE5',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    danger: '#EF4444',
    dangerBg: '#FEE2E2',
    
    // Badges
    badgePending: '#FFFBEB',
    badgePendingText: '#D97706',
    badgeDelivered: '#ECFDF5',
    badgeDeliveredText: '#059669',
    badgeCancelled: '#FEF2F2',
    badgeCancelledText: '#DC2626',
  },
  metrics: {
    cardRadius: 16,
    buttonHeight: 52,
    inputHeight: 48,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  typography: {
    title: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: '#111827',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#374151',
    },
    body: {
      fontSize: 14,
      color: '#4B5563',
    },
    caption: {
      fontSize: 12,
      color: '#9CA3AF',
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
  },
};
