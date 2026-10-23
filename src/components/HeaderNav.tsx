'use client';

import React from 'react';
import { StudioStatus } from '@/types/world';

interface HeaderNavProps {
  status: StudioStatus;
  worldName?: string;
  onNewWorld: () => void;
  onResetSimulation?: () => void;
  canResetSimulation?: boolean;
}

export function HeaderNav({
  status,
  worldName,
  onNewWorld,
  onResetSimulation,
  canResetSimulation = false,
}: HeaderNavProps) {
  const getStatusLabel = () => {
    switch (status) {
      case 'empty':
        return 'Ready for Premise';
      case 'generating-world':
        return 'Architecting World...';
      case 'world-active':
        return worldName ? `World Active: ${worldName}` : 'World Active';
      case 'simulating':
        return 'Simulating Consequences...';
      case 'comparison-active':
        return 'Counterfactual Active';
      case 'error':
        return 'Attention Needed';
      default:
        return 'Ready';
    }
  };

  const isGenerating = status === 'generating-world' || status === 'simulating';

  return (
    <header className="studio-header">
      <div className="brand-group">
        <div className="brand-icon">⚡</div>
        <div>
          <h1 className="brand-title">StoryWorld Architect</h1>
          <p className="brand-tagline">AI Worldbuilding & Counterfactual Simulation Laboratory</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="header-status-badge">
          <span className={`status-dot ${isGenerating ? 'pulsing' : ''}`} />
          <span>{getStatusLabel()}</span>
        </div>

        {canResetSimulation && onResetSimulation && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onResetSimulation}
            title="Restore baseline world without network requests"
          >
            ↺ Reset Simulation
          </button>
        )}

        {status !== 'empty' && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onNewWorld}
            disabled={isGenerating}
          >
            + New World
          </button>
        )}
      </div>
    </header>
  );
}
