'use client';

import React, { useState } from 'react';
import { WorldModel, WorldRuleEntity, StudioStatus } from '@/types/world';
import { HeaderNav } from '@/components/HeaderNav';
import { PremiseHero } from '@/components/PremiseHero';
import { WorldExplorer } from '@/components/WorldExplorer';
import { ErrorBanner } from '@/components/ErrorBanner';

export default function StudioPage() {
  const [status, setStatus] = useState<StudioStatus>('empty');
  const [baselineWorld, setBaselineWorld] = useState<WorldModel | null>(null);
  const [selectedRule, setSelectedRule] = useState<WorldRuleEntity | null>(null);
  const [lastPremise, setLastPremise] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateWorld = async (premise: string) => {
    setStatus('generating-world');
    setErrorMessage(null);
    setLastPremise(premise);

    try {
      const response = await fetch('/api/generate-world', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premise }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server returned error (${response.status})`);
      }

      setBaselineWorld(data);
      setStatus('world-active');
      // Default to selecting the first rule for convenience
      if (data.rules && data.rules.length > 0) {
        setSelectedRule(data.rules[0]);
      }
    } catch (err: any) {
      console.error('World generation failed:', err);
      setErrorMessage(err.message || 'Failed to generate world model.');
      setStatus('error');
    }
  };

  const handleNewWorld = () => {
    setBaselineWorld(null);
    setSelectedRule(null);
    setStatus('empty');
    setErrorMessage(null);
  };

  const handleRetry = () => {
    if (lastPremise) {
      handleGenerateWorld(lastPremise);
    } else {
      setStatus('empty');
      setErrorMessage(null);
    }
  };

  return (
    <main className="studio-container">
      <HeaderNav
        status={status}
        worldName={baselineWorld?.overview.name}
        onNewWorld={handleNewWorld}
      />

      {errorMessage && (
        <ErrorBanner
          message={errorMessage}
          onRetry={lastPremise ? handleRetry : undefined}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Premise Hero: Displayed when no world is active, or as collapsible prompt */}
      {!baselineWorld && (
        <PremiseHero
          onGenerate={handleGenerateWorld}
          isGenerating={status === 'generating-world'}
        />
      )}

      {/* 5-Domain World Explorer */}
      {baselineWorld && (
        <WorldExplorer
          world={baselineWorld}
          selectedRuleId={selectedRule?.id}
          onSelectRule={(rule) => setSelectedRule(rule)}
        />
      )}
    </main>
  );
}
