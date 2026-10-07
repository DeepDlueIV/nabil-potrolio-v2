'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, useCallback, useEffect, useState, type ReactNode } from 'react';
import { ComputePoster } from './ComputePoster';
import type { ScenePhase } from './compute-model';

const ComputeCanvas = dynamic(() => import('./ComputeCanvas').then((module) => module.ComputeCanvas), { ssr: false });

export type ComputeSceneProps = {
  phase: ScenePhase;
  running: boolean;
  active: boolean;
  reduced: boolean;
  forceFallback?: boolean;
  onSceneReady?: () => void;
};

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function supportsWebGL() {
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}

export function ComputeScene(props: ComputeSceneProps) {
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const onSceneReady = props.onSceneReady;
  const handleFailure = useCallback(() => { setWebgl(false); setReady(false); setChecked(true); onSceneReady?.(); }, [onSceneReady]);
  const handleReady = useCallback(() => { setReady(true); onSceneReady?.(); }, [onSceneReady]);

  useEffect(() => {
    if (props.forceFallback) { onSceneReady?.(); return; }
    const timer = window.setTimeout(() => {
      const supported = supportsWebGL();
      setWebgl(supported); setChecked(true);
      if (!supported) onSceneReady?.();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [props.forceFallback, onSceneReady]);

  const inside = props.phase === 'inside' || props.phase === 'flow';
  return (
    <div className="rack-scene" data-webgl={webgl && ready ? 'active' : 'fallback'} data-phase={props.phase} data-running={props.running} data-active={props.active} data-reduced={props.reduced} data-testid="compute-scene">
      {checked && !webgl || props.forceFallback
        ? <ComputePoster phase={props.phase} running={props.running} reduced={props.reduced} />
        : !ready && <Image className="hardware-poster" data-testid="compute-poster" src="/images/compute-rack-poster.png" alt="GPU server in a compact rack, ready for the presentation" fill unoptimized />}
      {webgl && !props.forceFallback && (
        <SceneBoundary onFailure={handleFailure}>
          <ComputeCanvas {...props} onContextLost={handleFailure} onReady={handleReady} />
        </SceneBoundary>
      )}
      <div className="rack-callouts" aria-hidden="true">
        <svg className="rack-leaders" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M9 24 L26 31" /><circle cx="26" cy="31" r=".3" />
          <path d={inside ? 'M94 42 L37 63' : 'M94 42 L47 52'} /><circle cx={inside ? 37 : 47} cy={inside ? 63 : 52} r=".3" />
          <path d="M12 80 L44 72" /><circle cx="44" cy="72" r=".3" />
        </svg>
        <span className="rack-label rack-label-network">Network entry</span>
        <span className={`rack-label rack-label-compute ${inside ? 'is-open' : ''}`}>{inside ? '8 accelerators · shared interconnect' : 'GPU compute tray'}</span>
        <span className="rack-label rack-label-data">Context &amp; storage</span>
      </div>
      {props.phase === 'flow' && <p className="rack-flow-legend"><span>Request</span><span>Context</span><span>Inference</span><span>Response</span></p>}
    </div>
  );
}
