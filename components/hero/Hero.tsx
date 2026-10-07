'use client';

import { profile } from '@/data/profile';
import { useCallback, useState } from 'react';
import { usePresentation } from '../presentation/usePresentation';
import { ComputeScene } from '../scene/ComputeScene';
import { heroDurations, heroPhases } from '../scene/compute-model';
import { HeroNarrative } from './HeroNarrative';
import './hero-showcase.css';

export function Hero({ forceFallback = false }: { forceFallback?: boolean }) {
  const [ready, setReady] = useState(forceFallback);
  const onReady = useCallback(() => setReady(true), []);
  const { ref, step, running, active, pageVisible, reduced, held, duration, progressKey, progress, select, resume, pause } = usePresentation({ id: 'hero', durations: heroDurations, ready });
  const phase = heroPhases[step];

  return (
    <section className="hero hero-showcase" id="top" aria-labelledby="hero-title">
      <div className="showcase-layout">
        <div className="hero-copy">
          <p className="hero-identity">{profile.name}</p>
          <p className="technical-label hero-role">{profile.title}<br />{profile.secondaryTitle}</p>
          <h1 id="hero-title" aria-label="Intelligence, engineered.">Intelligence,<br /><em>engineered.</em></h1>
          <p className="hero-lede">{profile.description}</p>
          <div className="hero-actions">
            <a className="button" href="#contact">Discuss your infrastructure <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#architecture">Explore the architecture <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-meta technical-label">{profile.location} <span /> {profile.availability} <span /> {profile.years} years of experience</p>
        </div>
        <div className="showcase-system" ref={ref}>
          <ComputeScene
            phase={phase}
            running={running}
            phaseProgress={progress}
            active={active && pageVisible}
            reduced={reduced}
            forceFallback={forceFallback}
            onSceneReady={onReady}
          />
          <p className="showcase-caption">A private AI system — from request to response</p>
          <HeroNarrative
            phase={phase}
            held={held}
            running={running}
            duration={duration}
            progressKey={progressKey}
            progress={progress}
            reduced={reduced}
            onPause={pause}
            onSelect={select}
            onResume={resume}
          />
          <p className="showcase-note">Illustrative infrastructure</p>
        </div>
      </div>
    </section>
  );
}
