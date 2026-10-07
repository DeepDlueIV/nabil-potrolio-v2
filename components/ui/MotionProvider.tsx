'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type MotionPreference = 'full' | 'reduced';

type MotionContextValue = {
  preference: MotionPreference;
  setPreference: (preference: MotionPreference) => void;
};

const defaultMotionContext: MotionContextValue = {
  preference: 'full',
  setPreference: () => undefined,
};

const MotionContext = createContext<MotionContextValue>(defaultMotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, updatePreference] = useState<MotionPreference>('full');

  useEffect(() => {
    // Презентация запускается по умолчанию; отключение движения — явный выбор посетителя.
    const frame = requestAnimationFrame(() => {
      try {
        if (localStorage.getItem('nabil-motion') === 'reduced') updatePreference('reduced');
      } catch { /* Блокировка хранилища не должна останавливать презентацию. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const setPreference = useCallback((next: MotionPreference) => {
    updatePreference(next);
    try { localStorage.setItem('nabil-motion', next); } catch { /* Выбор работает и без сохранения. */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = preference;
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [preference]);

  const value = useMemo(() => ({ preference, setPreference }), [preference, setPreference]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionPreference() {
  return useContext(MotionContext);
}
