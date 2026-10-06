'use client';

import { useCallback, useState } from 'react';
import { profile } from '@/data/profile';
import { ComputeScene } from '../scene/ComputeScene';
import { sceneComponents, type SceneComponentId, type SceneMode, type ScenePhase } from '../scene/compute-model';
import { HeroNarrative } from './HeroNarrative';

export function Hero({ forceFallback = false }: { forceFallback?: boolean }) {
  const [mode, setMode] = useState<SceneMode>('assembled');
  const [selected, setSelected] = useState<SceneComponentId>('accelerators');
  const [phase, setPhase] = useState<ScenePhase>('compute');
  const [paused, setPaused] = useState(false);
  const selectPhase = useCallback((next: ScenePhase) => setPhase(next), []);
  const selectedComponent = sceneComponents.find((component) => component.id === selected) ?? sceneComponents[0];

  return (
    <section className="hero" id="top" data-motion={paused ? 'paused' : 'full'} aria-labelledby="hero-title">
      <div className="hero-sticky">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-identity">Nabil Rakdani</p>
            <p className="technical-label hero-role">{profile.title}<br />{profile.secondaryTitle}</p>
            <h1 id="hero-title" aria-label="Intelligence, engineered.">Intelligence,<br /><em>engineered.</em></h1>
            <p className="hero-lede">{profile.description}</p>
            <div className="hero-actions">
              <a className="button" href="#contact">Discuss your infrastructure <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#architecture">Explore the architecture <span aria-hidden="true">↓</span></a>
            </div>
            <p className="hero-meta technical-label">{profile.location} <span /> {profile.availability} <span /> {profile.years} years of experience</p>
          </div>

          <div className="hero-system">
            <ComputeScene mode={mode} selected={selected} phase={phase} paused={paused} forceFallback={forceFallback} />
            <div className="scene-toolbar">
              <div className="segmented" aria-label="Scene arrangement">
                {(['assembled', 'exploded'] as SceneMode[]).map((item) => (
                  <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>{item[0].toUpperCase() + item.slice(1)}</button>
                ))}
              </div>
              <button className="motion-pause" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
                {paused ? 'Resume motion' : 'Pause motion'}
              </button>
            </div>
            <p className="sr-only" role="status" aria-label="Scene mode">{mode === 'assembled' ? 'Assembled view active' : 'Exploded view active'}</p>
            <div className="component-controls" aria-label="Compute cluster components">
              {sceneComponents.map((component, index) => (
                <button
                  key={component.id}
                  type="button"
                  className={selected === component.id ? 'is-selected' : ''}
                  aria-pressed={selected === component.id}
                  aria-label={`Select ${component.label.toLowerCase()}`}
                  onClick={() => setSelected(component.id)}
                >
                  <span>0{index + 1}</span>{component.shortLabel}
                </button>
              ))}
            </div>
            <p className="component-description" role="status" aria-label="Selected component">{selectedComponent.description}</p>
          </div>
        </div>
        <HeroNarrative activePhase={phase} onPhaseChange={selectPhase} />
      </div>
    </section>
  );
}
