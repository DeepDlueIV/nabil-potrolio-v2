'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionPreference } from '../ui/MotionProvider';
import { usePresentationEnvironment } from './PresentationProvider';

type PresentationOptions = { id: string; durations: readonly number[]; ready?: boolean; readyStep?: number; pauseOnHover?: boolean };

export function usePresentation({ id, durations, ready = true, readyStep, pauseOnHover = false }: PresentationOptions) {
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [source, setSource] = useState<'auto' | 'manual'>('auto');
  const { activeId, pageVisible, register, coordinated } = usePresentationEnvironment();
  const { preference } = useMotionPreference();
  const cleanup = useRef<(() => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const duration = durations[step] ?? durations[0];
  const active = !coordinated || activeId === id;
  const reduced = preference === 'reduced';
  const running = active && pageVisible && ready && (readyStep === undefined || readyStep === step) && !held && !hovered && !reduced;

  const cancel = useCallback(() => {
    generation.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const ref = useCallback((element: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = element ? register(id, element) : null;
  }, [id, register]);

  useEffect(() => {
    cancel();
    if (!running) return;
    const token = generation.current;
    timer.current = setTimeout(() => {
      if (generation.current !== token) return;
      setSource('auto');
      setStep((current) => (current + 1) % durations.length);
    }, duration);
    return cancel;
  }, [cancel, duration, durations.length, running, step]);

  const hold = useCallback(() => { cancel(); setHeld(true); setSource('manual'); }, [cancel]);
  const select = useCallback((index: number) => {
    hold();
    setStep(Math.max(0, Math.min(index, durations.length - 1)));
  }, [durations.length, hold]);
  const resume = useCallback(() => { cancel(); setHeld(false); setHovered(false); setSource('auto'); }, [cancel]);

  return {
    ref, step, held, source, active, pageVisible, reduced, running, duration,
    progressKey: `${step}-${running}-${source}`,
    select, resume,
    interactionProps: {
      onMouseEnter: () => { if (pauseOnHover) { cancel(); setHovered(true); } },
      onMouseLeave: () => { if (pauseOnHover) setHovered(false); },
      onFocusCapture: hold,
    },
  };
}
