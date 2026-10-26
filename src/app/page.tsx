
'use client';

import React, { useState } from 'react';
import type {
  WorldModel,
  WorldRuleEntity,
  SimulationResult,
  StudioStatus,
} from '@/types/world';
import { HeaderNav } from '@/components/HeaderNav';
import { PremiseHero } from '@/components/PremiseHero';
import { WorldExplorer } from '@/components/WorldExplorer';
import { ErrorBanner } from '@/components/ErrorBanner';
import { WhatIfLab } from '@/components/WhatIfLab';

interface ArtworkResult {
  worldName: string;
  imageDataUrl: string;
  mimeType: string;
}

export default function StudioPage() {
  const [status, setStatus] = useState<StudioStatus>('empty');
  const [baselineWorld, setBaselineWorld] = useState<WorldModel | null>(null);
  const [selectedRule, setSelectedRule] = useState<WorldRuleEntity | null>(null);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [lastPremise, setLastPremise] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [artwork, setArtwork] = useState<ArtworkResult | null>(null);
  const [artworkLoading, setArtworkLoading] = useState(false);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const generateArtwork = async (world: WorldModel) => {
    setArtwork(null);
    setArtworkError(null);
    setArtworkLoading(true);

    try {
      const response = await fetch('/api/generate-world-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ world }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Artwork generation failed (${response.status}).`,
        );
      }

      if (
        typeof data.imageDataUrl !== 'string' ||
        !data.imageDataUrl.startsWith('data:image/')
      ) {
        throw new Error('The image service returned no usable artwork.');
      }

      setArtwork({
        worldName: data.worldName || world.overview.name,
        imageDataUrl: data.imageDataUrl,
        mimeType: data.mimeType || 'image/jpeg',
      });
    } catch (error: unknown) {
      console.error('Artwork generation failed:', error);
      setArtworkError(
        error instanceof Error
          ? error.message
          : 'Could not generate world artwork.',
      );
    } finally {
      setArtworkLoading(false);
    }
  };

  const handleGenerateWorld = async (premise: string) => {
    setStatus('generating-world');
    setErrorMessage(null);
    setSimulationError(null);
    setSimulationResult(null);
    setArtwork(null);
    setArtworkError(null);
    setArtworkLoading(false);
    setLastPremise(premise);

    try {
      const response = await fetch('/api/generate-world', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premise }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Server returned error (${response.status})`,
        );
      }

      const world = data as WorldModel;
      setBaselineWorld(world);

      const firstRule =
        Array.isArray(world.rules) && world.rules.length > 0
          ? world.rules[0]
          : null;

      setSelectedRule(firstRule);
      setStatus('world-active');

      // Generate artwork independently so image failures do not
      // interrupt world generation or the What-If Lab.
      void generateArtwork(world);
    } catch (err: unknown) {
      console.error('World generation failed:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to generate world model.',
      );
      setStatus('error');
    }
  };

  const handleNewWorld = () => {
    setBaselineWorld(null);
    setSelectedRule(null);
    setSimulationResult(null);
    setSimulationError(null);
    setErrorMessage(null);
    setArtwork(null);
    setArtworkError(null);
    setArtworkLoading(false);
    setLastPremise('');
    setStatus('empty');
  };

  const handleSelectRule = (rule: WorldRuleEntity) => {
    setSelectedRule(rule);
    setSimulationResult(null);
    setSimulationError(null);
    setStatus('world-active');
  };

  const handleSimulationStart = () => {
    setSimulationError(null);
    setSimulationResult(null);
    setStatus('simulating');
  };

  const handleSimulationComplete = (result: SimulationResult) => {
    setSimulationResult(result);
    setSimulationError(null);
    setStatus('comparison-active');
  };

  const handleSimulationError = (message: string) => {
    setSimulationError(message);
    setStatus('world-active');
  };

  const handleRetry = () => {
    if (lastPremise) {
      void handleGenerateWorld(lastPremise);
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

      {!baselineWorld && (
        <PremiseHero
          onGenerate={handleGenerateWorld}
          isGenerating={status === 'generating-world'}
        />
      )}

      {baselineWorld && (
        <>
          {/* World artwork */}
          <section
            className="glass-card"
            aria-label="Generated world artwork"
            style={{
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              overflow: 'hidden',
              borderRadius: '1.25rem',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              background:
                'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 27, 75, 0.75))',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem 1rem' }}>
              <p
                style={{
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                World visualization
              </p>

              <h2
                style={{
                  color: '#f1f5f9',
                  fontSize: 'clamp(1.35rem, 3vw, 2rem)',
                  fontWeight: 750,
                  margin: 0,
                }}
              >
                {baselineWorld.overview.name}
              </h2>

              <p
                style={{
                  color: '#94a3b8',
                  marginTop: '0.5rem',
                  lineHeight: 1.7,
                }}
              >
                A visual interpretation of your world's atmosphere,
                environments, and defining conflict.
              </p>
            </div>

            {artworkLoading && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '2rem',
                  background:
                    'radial-gradient(ellipse at center, rgba(56,189,248,0.12), transparent 70%)',
                  textAlign: 'center',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: '42px',
                    height: '42px',
                    border: '3px solid rgba(56,189,248,0.2)',
                    borderTopColor: '#38bdf8',
                    borderRadius: '50%',
                    animation: 'storyworld-spin 1s linear infinite',
                  }}
                />
                <div>
                  <p style={{ color: '#e2e8f0', fontWeight: 650 }}>
                    Painting your world...
                  </p>
                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      marginTop: '0.4rem',
                    }}
                  >
                    Cloudflare AI is creating your environment artwork.
                    This can take a little while.
                  </p>
                </div>
                <style>{`
                  @keyframes storyworld-spin {
                    to { transform: rotate(360deg); }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    div[role="status"] div[aria-hidden="true"] {
                      animation: none !important;
                    }
                  }
                `}</style>
              </div>
            )}

            {!artworkLoading && artwork && (
              <div>
                <img
                  src={artwork.imageDataUrl}
                  alt={`AI-generated environment artwork for ${artwork.worldName}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '620px',
                    minHeight: '220px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    background: '#0b1120',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.85rem 1.25rem',
                    background: 'rgba(2, 6, 23, 0.55)',
                  }}
                >
                  <span style={{ color: '#a5f3fc', fontSize: '0.85rem' }}>
                    ✦ AI-generated world artwork
                  </span>
                  <button
                    type="button"
                    onClick={() => void generateArtwork(baselineWorld)}
                    disabled={artworkLoading}
                    style={{
                      border: '1px solid rgba(56,189,248,0.4)',
                      borderRadius: '0.6rem',
                      padding: '0.55rem 0.85rem',
                      background: 'rgba(56,189,248,0.08)',
                      color: '#7dd3fc',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Regenerate artwork
                  </button>
                </div>
              </div>
            )}

            {!artworkLoading && artworkError && (
              <div
                role="alert"
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid rgba(248,113,113,0.2)',
                  background: 'rgba(127,29,29,0.12)',
                }}
              >
                <p style={{ color: '#fecaca', fontWeight: 650 }}>
                  Artwork could not be generated
                </p>
                <p
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.7,
                    marginTop: '0.5rem',
                  }}
                >
                  {artworkError}
                </p>
                <button
                  type="button"
                  onClick={() => void generateArtwork(baselineWorld)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.65rem 1rem',
                    border: '1px solid rgba(56,189,248,0.4)',
                    borderRadius: '0.6rem',
                    background: 'rgba(56,189,248,0.1)',
                    color: '#7dd3fc',
                    cursor: 'pointer',
                    fontWeight: 650,
                  }}
                >
                  Try artwork again
                </button>
              </div>
            )}
          </section>

          <WorldExplorer
            world={baselineWorld}
            selectedRuleId={selectedRule?.id}
            onSelectRule={handleSelectRule}
          />

          <section
            className="glass-card"
            style={{
              marginTop: '2rem',
              padding: 'clamp(1rem, 3vw, 2rem)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Counterfactual simulation
              </p>

              <h2
                style={{
                  color: '#f1f5f9',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}
              >
                What-If Lab
              </h2>

              <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                Change one rule in your world and explore how that change
                could affect its characters, factions, and locations.
              </p>
            </div>

            <WhatIfLab
              world={baselineWorld}
              selectedRule={selectedRule}
              onSelectRule={handleSelectRule}
              onSimulationComplete={handleSimulationComplete}
              onSimulationStart={handleSimulationStart}
              onSimulationError={handleSimulationError}
              isSimulating={status === 'simulating'}
            />

            {simulationError && (
              <div
                role="alert"
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  border: '1px solid rgba(248, 113, 113, 0.45)',
                  borderRadius: '0.75rem',
                  background: 'rgba(127, 29, 29, 0.18)',
                  color: '#fecaca',
                  lineHeight: 1.6,
                }}
              >
                <strong>Simulation failed.</strong> {simulationError}
                <button
                  type="button"
                  onClick={() => setSimulationError(null)}
                  aria-label="Dismiss simulation error"
                  style={{
                    display: 'block',
                    marginTop: '0.5rem',
                    padding: '0.25rem 0',
                    border: 0,
                    background: 'transparent',
                    color: '#fca5a5',
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {simulationResult && (
              <section
                aria-live="polite"
                style={{
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                }}
              >
                <p
                  style={{
                    color: '#34d399',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Simulation complete
                </p>

                <h3
                  style={{
                    color: '#f1f5f9',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  How your world changes
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(148, 163, 184, 0.07)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                    }}
                  >
                    <p
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.8rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Original rule
                    </p>
                    <p style={{ color: '#e2e8f0', lineHeight: 1.7 }}>
                      {simulationResult.original_rule_statement}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      background: 'rgba(56, 189, 248, 0.07)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                    }}
                  >
                    <p
                      style={{
                        color: '#38bdf8',
                        fontSize: '0.8rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Proposed rule
                    </p>
                    <p style={{ color: '#e2e8f0', lineHeight: 1.7 }}>
                      {simulationResult.counterfactual_rule}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4
                    style={{
                      color: '#c4b5fd',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                    }}
                  >
                    World-level consequences
                  </h4>
                  <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                    {simulationResult.macro_shift_summary}
                  </p>
                </div>

                {(
                  [
                    {
                      title: 'Character impacts',
                      color: '#38bdf8',
                      impacts: simulationResult.character_impacts,
                    },
                    {
                      title: 'Faction impacts',
                      color: '#c084fc',
                      impacts: simulationResult.faction_impacts,
                    },
                    {
                      title: 'Location impacts',
                      color: '#fbbf24',
                      impacts: simulationResult.location_impacts,
                    },
                  ] as const
                ).map((group) => (
                  <div key={group.title} style={{ marginTop: '1.5rem' }}>
                    <h4
                      style={{
                        color: group.color,
                        fontWeight: 700,
                        marginBottom: '0.75rem',
                      }}
                    >
                      {group.title}
                    </h4>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                        gap: '0.75rem',
                      }}
                    >
                      {group.impacts.map((impact) => (
                        <article
                          key={impact.entity_id}
                          style={{
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(148, 163, 184, 0.18)',
                          }}
                        >
                          <h5
                            style={{
                              color: '#f1f5f9',
                              fontSize: '1rem',
                              fontWeight: 700,
                              marginBottom: '0.75rem',
                            }}
                          >
                            {impact.entity_name}
                          </h5>

                          <p
                            style={{
                              color: '#cbd5e1',
                              lineHeight: 1.7,
                              marginBottom: '0.75rem',
                            }}
                          >
                            {impact.immediate_effect}
                          </p>

                          <p
                            style={{
                              color: '#94a3b8',
                              fontSize: '0.9rem',
                              lineHeight: 1.7,
                              marginBottom: '0.75rem',
                            }}
                          >
                            <strong style={{ color: '#c4b5fd' }}>
                              Why it happens:{' '}
                            </strong>
                            {impact.causal_reasoning}
                          </p>

                          <p
                            style={{
                              color: '#a7f3d0',
                              fontSize: '0.9rem',
                              lineHeight: 1.7,
                            }}
                          >
                            <strong>Status or power shift: </strong>
                            {impact.status_or_power_shift}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </section>
        </>
      )}
    </main>
  );
}
