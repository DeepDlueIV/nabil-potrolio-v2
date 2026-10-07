'use client';

import { useEffect, useState } from 'react';

export function useReadyFrame(requested: number, prepare: (index: number) => Promise<boolean>, enabled = true, onReady?: (index: number) => void) {
  const [frame, setFrame] = useState({ index: 0, previous: null as number | null, ready: false, failed: false });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const finish = (success: boolean) => {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(timeout);
      setFrame((current) => ({ index: requested, previous: current.index !== requested && current.ready ? current.index : null, ready: true, failed: !success }));
      onReady?.(requested);
    };
    const timeout = setTimeout(() => finish(false), 6000);
    void prepare(requested).then(finish, () => finish(false));
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [enabled, prepare, requested, onReady]);

  return frame;
}
