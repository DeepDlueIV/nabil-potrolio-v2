'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type MotionPreference = 'full' | 'reduced';

type MotionContextValue = {
  preference: MotionPreference;
};

const defaultMotionContext: MotionContextValue = {
  preference: 'full',
};

const MotionContext = createContext<MotionContextValue>(defaultMotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<MotionPreference>('full');

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => setPreference(media.matches ? 'reduced' : 'full');
    const frame = requestAnimationFrame(update);
    media.addEventListener('change', update);
    return () => { cancelAnimationFrame(frame); media.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = preference;
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [preference]);

  const value = useMemo(() => ({ preference }), [preference]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionPreference() {
  return useContext(MotionContext);
}
