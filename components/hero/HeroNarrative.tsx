'use client';

import { useRef, type KeyboardEvent } from 'react';
import { phaseCopy, type ScenePhase } from '../scene/compute-model';

const phases: ScenePhase[] = ['system', 'inside', 'flow'];

export function HeroNarrative({ phase, held, progress, reduced, onPause, onSelect, onResume }: {
  phase: ScenePhase;
  held: boolean;
  running: boolean;
  duration: number;
  progressKey: string;
  progress: number;
  reduced: boolean;
  onPause: () => void;
  onSelect: (index: number) => void;
  onResume: () => void;
}) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = phase === 'return' ? 'system' : phase;
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % 3
      : event.key === 'ArrowLeft' ? (index + 2) % 3
      : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : null;
    if (next === null) return;
    event.preventDefault();
    onSelect(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="showcase-narrative">
      <div className="showcase-tabs" role="tablist" aria-label="Server presentation">
        {phases.map((item, index) => (
          <button
            key={item}
            id={`hero-tab-${item}`}
            ref={(node) => { tabs.current[index] = node; }}
            type="button"
            role="tab"
            aria-controls="hero-phase-description"
            aria-selected={selected === item}
            tabIndex={selected === item ? 0 : -1}
            onFocus={() => onSelect(index)}
            onKeyDown={(event) => handleKey(event, index)}
            onClick={() => onSelect(index)}
          >{phaseCopy[item].title}</button>
        ))}
        {!reduced && <button data-presentation-playback type="button" aria-label={held ? 'Resume server presentation' : 'Pause server presentation'} onClick={held ? onResume : onPause}>{held ? '▶' : 'Ⅱ'}</button>}
      </div>
      <div className="showcase-progress" aria-hidden="true">
        <span style={{ animation: 'none', transform: `scaleX(${progress})` }} />
      </div>
      <p id="hero-phase-description" role="tabpanel" aria-labelledby={`hero-tab-${selected}`} className="showcase-phase-copy">{phaseCopy[phase].body}</p>
    </div>
  );
}
