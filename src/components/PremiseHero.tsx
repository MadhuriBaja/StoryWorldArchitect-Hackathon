'use client';

import React, { useState } from 'react';
import { PRESET_WORLDS } from '@/lib/presets';
import { PresetWorld } from '@/types/world';

interface PremiseHeroProps {
  onGenerate: (premise: string) => void;
  isGenerating: boolean;
  isCompact?: boolean;
}

export function PremiseHero({ onGenerate, isGenerating, isCompact = false }: PremiseHeroProps) {
  const [premiseText, setPremiseText] = useState('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const charCount = premiseText.trim().length;
  const isMinimumMet = charCount >= 10;

  const handleSelectPreset = (preset: PresetWorld) => {
    setActivePresetId(preset.id);
    setPremiseText(preset.premise);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinimumMet || isGenerating) return;
    onGenerate(premiseText.trim());
  };

  if (isCompact) {
    return null;
  }

  return (
    <section className="hero-box">
      <h2 className="hero-title">
        <span>✨</span> Enter World Premise or Choose a Quick-Start Preset
      </h2>
      <p className="hero-desc">
        Describe a fictional realm with rules, magic, technology, or societal taboos. StoryWorld Architect will synthesize an interconnected 5-domain world you can test in the What-If Lab.
      </p>

      <form onSubmit={handleSubmit} className="premise-input-group">
        <textarea
          className="premise-textarea"
          value={premiseText}
          onChange={(e) => {
            setPremiseText(e.target.value);
            setActivePresetId(null);
          }}
          placeholder="E.g., A floating archipelago where magnetic gravity crystals power airships, and rival navigator guilds control the only known trade winds..."
          disabled={isGenerating}
          rows={3}
        />

        <div className="input-footer">
          <div>
            <span style={{ color: isMinimumMet ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
              {charCount} / 10 minimum characters
            </span>
            {!isMinimumMet && charCount > 0 && (
              <span style={{ color: 'var(--accent-amber)', marginLeft: '0.5rem' }}>
                (Needs {10 - charCount} more chars)
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!isMinimumMet || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                <span>Synthesizing World...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Architect World</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="presets-section">
        <div className="presets-label">⚡ Or Quick-Start with a Tested Scenario:</div>
        <div className="preset-chips-grid">
          {PRESET_WORLDS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                type="button"
                key={preset.id}
                className={`preset-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectPreset(preset)}
                disabled={isGenerating}
              >
                <div className="preset-chip-title">{preset.title}</div>
                <div className="preset-chip-desc">{preset.tagline}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
