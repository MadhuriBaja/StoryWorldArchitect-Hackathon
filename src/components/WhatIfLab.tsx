 'use client';

import React, { useEffect, useState } from 'react';
import type { SimulationResult, WorldModel, WorldRuleEntity } from '@/types/world';

interface WhatIfLabProps {
  world: WorldModel;
  selectedRule: WorldRuleEntity | null;
  onSelectRule: (rule: WorldRuleEntity) => void;
  onSimulationComplete: (result: SimulationResult) => void;
  onSimulationStart: () => void;
  onSimulationError: (message: string) => void;
  isSimulating: boolean;
}

export function WhatIfLab({
  world,
  selectedRule,
  onSelectRule,
  onSimulationComplete,
  onSimulationStart,
  onSimulationError,
  isSimulating,
}: WhatIfLabProps) {
  const [proposedRule, setProposedRule] = useState('');

  useEffect(() => {
    setProposedRule(selectedRule?.rule_statement ?? '');
  }, [selectedRule?.id, selectedRule?.rule_statement]);

  async function handleSimulate() {
    if (!selectedRule) {
      onSimulationError('Select a world rule before running a simulation.');
      return;
    }

    const hypothesis = proposedRule.trim();

    if (hypothesis.length < 10) {
      onSimulationError('Your replacement rule must contain at least 10 characters.');
      return;
    }

    if (hypothesis.length > 1000) {
      onSimulationError('Your replacement rule must be 1,000 characters or fewer.');
      return;
    }

    if (hypothesis === selectedRule.rule_statement.trim()) {
      onSimulationError('Change the selected rule before simulating its consequences.');
      return;
    }

    onSimulationStart();

    try {
      const response = await fetch('/api/simulate-consequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baselineWorld: world,
          selectedRuleId: selectedRule.id,
          proposedRule: hypothesis,
        }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data &&
          typeof data === 'object' &&
          'error' in data &&
          typeof data.error === 'string'
            ? data.error
            : `Simulation failed (HTTP ${response.status}). Please try again.`;

        throw new Error(message);
      }

      if (!data || typeof data !== 'object') {
        throw new Error('The simulation returned an invalid response.');
      }

      const result = data as SimulationResult;

      if (
        result.changed_rule_id !== selectedRule.id ||
        result.counterfactual_rule !== hypothesis ||
        !Array.isArray(result.character_impacts) ||
        !Array.isArray(result.faction_impacts) ||
        !Array.isArray(result.location_impacts)
      ) {
        throw new Error('The simulation response did not match the selected hypothesis.');
      }

      onSimulationComplete(result);
    } catch (error: unknown) {
      onSimulationError(
        error instanceof Error
          ? error.message
          : 'An unexpected simulation error occurred.'
      );
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    background: 'rgba(7, 13, 25, 0.8)',
    color: '#f8fafc',
    font: 'inherit',
    lineHeight: 1.6,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#cbd5e1',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  };

  return (
    <section
      className="glass-card"
      aria-labelledby="what-if-lab-title"
      style={{
        marginTop: '1.5rem',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background:
          'linear-gradient(145deg, rgba(15, 23, 42, 0.97), rgba(30, 27, 75, 0.72))',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="entity-badge badge-cyan">COUNTERFACTUAL SIMULATION</span>
        <h2
          id="what-if-lab-title"
          style={{
            color: '#f8fafc',
            fontSize: '1.65rem',
            marginTop: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          What-If Lab
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Change one foundational law. Discover how that single change ripples
          through the people, power structures, and places of your world.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        <div>
          <label htmlFor="what-if-rule" style={labelStyle}>
            1. Choose a world rule
          </label>
          <select
            id="what-if-rule"
            value={selectedRule?.id ?? ''}
            disabled={isSimulating}
            onChange={(event) => {
              const rule = world.rules.find(
                (item) => item.id === event.target.value
              );
              if (rule) onSelectRule(rule);
            }}
            style={fieldStyle}
          >
            <option value="" disabled>
              Select a foundational rule
            </option>
            {world.rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>

          {selectedRule && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                marginTop: '0.65rem',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#38bdf8' }}>Original law:</strong>{' '}
              {selectedRule.rule_statement}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="what-if-hypothesis" style={labelStyle}>
            2. Rewrite the rule
          </label>
          <textarea
            id="what-if-hypothesis"
            value={proposedRule}
            onChange={(event) => setProposedRule(event.target.value)}
            disabled={isSimulating || !selectedRule}
            maxLength={1000}
            rows={4}
            placeholder="What if magic worked only at night, but each spell erased one memory?"
            style={{
              ...fieldStyle,
              resize: 'vertical',
              minHeight: '120px',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              marginTop: '0.4rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>Make a meaningful change to the world's law.</span>
            <span>{proposedRule.length}/1000</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleSimulate}
          disabled={
            isSimulating ||
            !selectedRule ||
            proposedRule.trim().length < 10 ||
            proposedRule.trim() === selectedRule.rule_statement.trim()
          }
          style={{
            width: '100%',
            padding: '0.95rem 1.25rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.65rem',
            opacity:
              isSimulating ||
              !selectedRule ||
              proposedRule.trim().length < 10 ||
              proposedRule.trim() === selectedRule.rule_statement.trim()
                ? 0.65
                : 1,
          }}
        >
          {isSimulating ? 'Simulating consequences…' : 'Simulate Consequences →'}
        </button>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
          }}
        >
          AI-generated hypotheses are exploratory, not predictions. Your
          original world remains the baseline for comparison.
        </p>
      </div>
    </section>
  );
}
