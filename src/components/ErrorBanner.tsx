'use client';

import React from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <div>
          <strong style={{ color: '#fff', display: 'block', fontSize: '0.85rem' }}>
            System Notice
          </strong>
          <span className="error-text">{message}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            🔄 Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
