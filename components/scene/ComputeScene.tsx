'use client';

import dynamic from 'next/dynamic';
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
  const handleFailure = useCallback(() => { setWebgl(false); setReady(false); }, []);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (props.forceFallback) return;
    const timer = window.setTimeout(() => setWebgl(supportsWebGL()), 0);
    return () => window.clearTimeout(timer);
  }, [props.forceFallback]);

  const inside = props.phase === 'inside' || props.phase === 'flow';
  return (
    <div className="rack-scene" data-webgl={webgl && ready ? 'active' : 'fallback'} data-phase={props.phase} data-running={props.running} data-active={props.active} data-reduced={props.reduced} data-testid="compute-scene">
      <ComputePoster phase={props.phase} running={props.running} reduced={props.reduced} />
      {webgl && !props.forceFallback && (
        <SceneBoundary onFailure={handleFailure}>
          <ComputeCanvas {...props} onContextLost={handleFailure} onReady={handleReady} />
        </SceneBoundary>
      )}
      <div className="rack-callouts" aria-hidden="true">
        <span className="rack-label rack-label-network">Network entry</span>
        <span className={`rack-label rack-label-compute ${inside ? 'is-open' : ''}`}>{inside ? '8 accelerators · shared interconnect' : 'GPU compute tray'}</span>
        <span className="rack-label rack-label-data">Context &amp; storage</span>
      </div>
      {props.phase === 'flow' && <p className="rack-flow-legend"><span>Request</span><span>Context</span><span>Inference</span><span>Response</span></p>}
    </div>
  );
}
