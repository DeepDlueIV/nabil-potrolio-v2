'use client';

import { useEffect, useRef, useState } from 'react';
import { phaseCopy, type ScenePhase } from '../scene/compute-model';

const phases: ScenePhase[] = ['compute', 'orchestration', 'system'];

export function HeroNarrative({
  activePhase,
  onPhaseChange,
  reduced,
}: {
  activePhase: ScenePhase;
  onPhaseChange: (phase: ScenePhase) => void;
  reduced: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const phaseTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const [manual, setManual] = useState(false);

  const handlePhaseKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % phases.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + phases.length) % phases.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = phases.length - 1;
    else return;

    event.preventDefault();
    setManual(true);
    onPhaseChange(phases[nextIndex]);
    phaseTabs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    if (manual || reduced || !root.current || typeof window.matchMedia !== 'function' || window.matchMedia('(max-width: 840px), (prefers-reduced-motion: reduce)').matches) return;
    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: root.current.closest('.hero'),
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: ({ progress }) => onPhaseChange(phases[Math.min(2, Math.floor(progress * 3))]),
      });
      cleanup = () => trigger.kill();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [manual, onPhaseChange, reduced]);

  return (
    <div className="hero-narrative" ref={root} aria-label="System narrative">
      <div className="phase-tabs" role="tablist" aria-label="Architecture phase">
        {phases.map((phase, index) => (
          <button
            key={phase}
            ref={(node) => { phaseTabs.current[index] = node; }}
            type="button"
            role="tab"
            aria-selected={activePhase === phase}
            tabIndex={activePhase === phase ? 0 : -1}
            onKeyDown={(event) => handlePhaseKey(event, index)}
            onClick={() => { setManual(true); onPhaseChange(phase); }}
          >
            <span>{phaseCopy[phase].index}</span>{phaseCopy[phase].title}
          </button>
        ))}
      </div>
      <div className="phase-copy" aria-live="polite">
        <p className="technical-label">PHASE {phaseCopy[activePhase].index}</p>
        <h2>{phaseCopy[activePhase].title}</h2>
        <p>{phaseCopy[activePhase].body}</p>
      </div>
    </div>
  );
}
