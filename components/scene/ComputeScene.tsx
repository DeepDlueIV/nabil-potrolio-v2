'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ComputePoster } from './ComputePoster';
import type { SceneComponentId, SceneMode, ScenePhase } from './compute-model';

const ComputeCanvas = dynamic(() => import('./ComputeCanvas').then((module) => module.ComputeCanvas), { ssr: false });

export type ComputeSceneProps = {
  mode: SceneMode;
  selected: SceneComponentId;
  phase: ScenePhase;
  paused: boolean;
  forceFallback?: boolean;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function ComputeScene(props: ComputeSceneProps) {
  const [webgl, setWebgl] = useState(false);
  const [visible, setVisible] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const handleContextLost = useCallback(() => setWebgl(false), []);

  useEffect(() => {
    if (props.forceFallback) return;
    const timer = window.setTimeout(() => setWebgl(supportsWebGL()), 0);
    return () => window.clearTimeout(timer);
  }, [props.forceFallback]);

  useEffect(() => {
    const element = container.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className="compute-scene"
      data-webgl={webgl ? 'active' : 'fallback'}
      data-paused={props.paused}
      data-testid="compute-scene"
    >
      <ComputePoster mode={props.mode} selected={props.selected} phase={props.phase} />
      {webgl && <ComputeCanvas mode={props.mode} selected={props.selected} phase={props.phase} paused={props.paused} visible={visible} onContextLost={handleContextLost} />}
    </div>
  );
}
