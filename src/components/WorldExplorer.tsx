'use client';

import React, { useState } from 'react';
import { WorldModel, WorldRuleEntity } from '@/types/world';

interface WorldExplorerProps {
  world: WorldModel;
  selectedRuleId?: string | null;
  onSelectRule?: (rule: WorldRuleEntity) => void;
}

export function WorldExplorer({
  world,
  selectedRuleId,
  onSelectRule,
}: WorldExplorerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'characters' | 'factions' | 'locations' | 'rules'>('all');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <span className="entity-badge badge-cyan" style={{ marginBottom: '0.35rem', display: 'inline-block' }}>
              World Overview
            </span>
            <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>{world.overview.name}</h2>
          </div>
          <div className="entity-badge badge-purple">
            {world.overview.defining_theme}
          </div>
        </div>

        <p style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.75rem' }}>
          {world.overview.premise_summary}
        </p>

        <div style={{ background: 'rgba(10, 15, 30, 0.7)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <strong style={{ color: 'var(--accent-amber)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ⚔️ Core Systemic Conflict:
          </strong>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {world.overview.core_conflict}
          </p>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <nav className="domain-nav">
        <button
          type="button"
          className={`domain-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>🌐</span> All Domains
        </button>
        <button
          type="button"
          className={`domain-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <span>⚖️</span> World Rules ({world.rules.length})
        </button>
        <button
          type="button"
          className={`domain-tab-btn ${activeTab === 'characters' ? 'active' : ''}`}
          onClick={() => setActiveTab('characters')}
        >
          <span>👤</span> Characters ({world.characters.length})
        </button>
        <button
          type="button"
          className={`domain-tab-btn ${activeTab === 'factions' ? 'active' : ''}`}
          onClick={() => setActiveTab('factions')}
        >
          <span>⚔️</span> Factions ({world.factions.length})
        </button>
        <button
          type="button"
          className={`domain-tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          <span>🏰</span> Locations ({world.locations.length})
        </button>
      </nav>

      {/* Domain 1: World Rules */}
      {(activeTab === 'all' || activeTab === 'rules') && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚖️</span> Foundational World Rules ({world.rules.length})
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
              — Pick one to alter in the What-If Lab
            </span>
          </h3>

          <div className="entities-grid">
            {world.rules.map((rule) => {
              const isSelected = selectedRuleId === rule.id;
              return (
                <div
                  key={rule.id}
                  className="entity-card rule-card"
                  style={{
                    borderColor: isSelected ? 'var(--accent-cyan)' : undefined,
                    boxShadow: isSelected ? '0 0 15px var(--accent-cyan-glow)' : undefined,
                  }}
                >
                  <div className="entity-header">
                    <div className="entity-name">{rule.name}</div>
                    <span className="meta-tag">{rule.id}</span>
                  </div>

                  <div className="rule-statement">
                    "{rule.rule_statement}"
                  </div>

                  <div className="entity-detail">
                    <strong>Systemic Anchor:</strong> {rule.systemic_importance}
                  </div>

                  <div className="entity-meta-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Fundamental Law
                    </span>
                    {onSelectRule && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0.75rem',
                          color: isSelected ? '#fff' : 'var(--accent-cyan)',
                          borderColor: isSelected ? 'var(--accent-cyan)' : 'rgba(56, 189, 248, 0.3)',
                        }}
                        onClick={() => onSelectRule(rule)}
                      >
                        {isSelected ? '✓ Selected in Lab' : 'Select for What-If →'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Domain 2: Characters */}
      {(activeTab === 'all' || activeTab === 'characters') && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-violet)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👤</span> Key Characters ({world.characters.length})
          </h3>

          <div className="entities-grid">
            {world.characters.map((char) => (
              <div key={char.id} className="entity-card">
                <div className="entity-header">
                  <div>
                    <div className="entity-name">{char.name}</div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-violet)' }}>{char.role}</span>
                  </div>
                  <span className="meta-tag">{char.id}</span>
                </div>

                <div className="entity-detail">
                  <strong>Motivation:</strong> {char.motivation}
                </div>

                <div className="entity-detail">
                  <strong>Rule Dependency:</strong> {char.connection_to_rule}
                </div>

                <div className="entity-meta-row">
                  <span className="entity-badge badge-purple">
                    Allegiance: {char.faction_allegiance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Domain 3: Factions */}
      {(activeTab === 'all' || activeTab === 'factions') && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-amber)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚔️</span> Factions & Power Blocs ({world.factions.length})
          </h3>

          <div className="entities-grid">
            {world.factions.map((fac) => (
              <div key={fac.id} className="entity-card">
                <div className="entity-header">
                  <div className="entity-name">{fac.name}</div>
                  <span className="meta-tag">{fac.id}</span>
                </div>

                <div className="entity-detail">
                  <strong>Agenda:</strong> {fac.agenda}
                </div>

                <div className="entity-detail">
                  <strong>Power Base:</strong> {fac.power_source}
                </div>

                <div className="entity-detail">
                  <strong>Territory:</strong> {fac.territory}
                </div>

                <div className="entity-meta-row">
                  <span className="entity-badge badge-amber">
                    Rival: {fac.rivalry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Domain 4: Locations */}
      {(activeTab === 'all' || activeTab === 'locations') && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🏰</span> Key Locations ({world.locations.length})
          </h3>

          <div className="entities-grid">
            {world.locations.map((loc) => (
              <div key={loc.id} className="entity-card">
                <div className="entity-header">
                  <div className="entity-name">{loc.name}</div>
                  <span className="meta-tag">{loc.id}</span>
                </div>

                <div className="entity-detail">
                  <strong>Environment:</strong> {loc.environment}
                </div>

                <div className="entity-detail">
                  <strong>Strategic Value:</strong> {loc.strategic_value}
                </div>

                <div className="entity-detail">
                  <strong>Rule Manifestation:</strong> {loc.connection_to_rule}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
