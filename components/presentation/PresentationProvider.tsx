'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type PresentationContextValue = {
  activeId: string | null;
  pageVisible: boolean;
  register: (id: string, element: HTMLElement) => () => void;
  coordinated: boolean;
  visibleIds: ReadonlySet<string>;
};

const PresentationContext = createContext<PresentationContextValue>({
  activeId: null, pageVisible: true, register: () => () => undefined, coordinated: false, visibleIds: new Set(),
});

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const [visibleIds, setVisibleIds] = useState<ReadonlySet<string>>(new Set());
  const entries = useRef(new Map<string, { element: HTMLElement; ratio: number }>());
  const observer = useRef<IntersectionObserver | null>(null);

  const choose = useCallback(() => {
    const candidates = Array.from(entries.current.entries()).sort((a, b) => b[1].ratio - a[1].ratio);
    const best = candidates[0];
    // Видимые показы независимы: соседний блок не отбирает время у текущего.
    setVisibleIds(new Set(candidates.filter(([, entry]) => entry.ratio > 0).map(([id]) => id)));
    setActiveId(best && best[1].ratio > 0 ? best[0] : null);
  }, []);

  useEffect(() => {
    const visibilityChanged = () => setPageVisible(document.visibilityState !== 'hidden');
    visibilityChanged();
    document.addEventListener('visibilitychange', visibilityChanged);
    if (typeof IntersectionObserver !== 'undefined') {
      observer.current = new IntersectionObserver((updates) => {
        for (const update of updates) {
          const entry = Array.from(entries.current.values()).find((candidate) => candidate.element === update.target);
          if (entry) entry.ratio = update.isIntersecting ? update.intersectionRatio : 0;
        }
        choose();
      }, { threshold: [0, .01, .1, .5, 1] });
      for (const entry of entries.current.values()) observer.current.observe(entry.element);
    } else {
      for (const entry of entries.current.values()) entry.ratio = 1;
      choose();
    }
    return () => {
      observer.current?.disconnect();
      observer.current = null;
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, [choose]);

  const register = useCallback((id: string, element: HTMLElement) => {
    entries.current.set(id, { element, ratio: 0 });
    observer.current?.observe(element);
    return () => {
      observer.current?.unobserve(element);
      entries.current.delete(id);
      choose();
    };
  }, [choose]);

  const value = useMemo(() => ({ activeId, pageVisible, register, coordinated: true, visibleIds }), [activeId, pageVisible, register, visibleIds]);
  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}

export function usePresentationEnvironment() { return useContext(PresentationContext); }
