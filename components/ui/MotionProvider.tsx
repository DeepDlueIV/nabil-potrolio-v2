'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type MotionPreference = 'full' | 'reduced';

type MotionContextValue = {
  preference: MotionPreference;
  setPreference: (preference: MotionPreference) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<MotionPreference>('full');

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media?.matches) return;
    const frame = requestAnimationFrame(() => setPreference('reduced'));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = preference;
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [preference]);

  const value = useMemo(() => ({ preference, setPreference }), [preference]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionPreference() {
  const context = useContext(MotionContext);
  if (!context) throw new Error('useMotionPreference must be used inside MotionProvider');
  return context;
}

export function MotionControl() {
  const { preference, setPreference } = useMotionPreference();
  const reduced = preference === 'reduced';

  return (
    <button
      className="motion-control"
      type="button"
      aria-label={reduced ? 'Use full motion' : 'Reduce motion'}
      aria-pressed={reduced}
      onClick={() => setPreference(reduced ? 'full' : 'reduced')}
    >
      <span aria-hidden="true" className="motion-control__signal" />
      Motion: {reduced ? 'reduced' : 'full'}
    </button>
  );
}
