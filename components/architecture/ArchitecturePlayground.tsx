'use client';

import { useRef } from 'react';
import { architectureScenarios } from '@/data/architecture-scenarios';
import { createInitialPlaygroundState, getActiveRoute, playgroundReducer } from '@/lib/architecture/playground-reducer';
import { usePresentation } from '../presentation/usePresentation';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import './architecture-showcase.css';

const durations = Array.from({ length: 15 }, () => 3200);
const stageTitles = [
  ['Private request', 'Context retrieval', 'Demand increases', 'Inference rerouted', 'Primary restored'],
  ['Events in motion', 'Stream processing', 'Burst absorbed', 'Worker rerouted', 'Processing restored'],
  ['Authenticated request', 'Policy and inference', 'Demand increases', 'Request queued', 'Inference restored'],
];
const descriptions = [
  ['A request retrieves context and receives a private model response.', 'The vector store returns relevant context to retrieval before inference.', 'More requests follow the same retrieval and inference path.', 'Inference A is unavailable; context reaches the available Inference B.', 'Inference A is healthy again and resumes the primary request path.'],
  ['Producers publish events; workers turn them into usable output.', 'Workers update live state for downstream consumers.', 'The event backbone absorbs a brief increase in incoming events.', 'Worker A is unavailable; Worker B processes events for analytics.', 'Worker A returns and the primary processing path resumes.'],
  ['Identity and policy authorize a request inside the private boundary.', 'Authorized requests reach private inference; output stays governed.', 'More authorized requests reach the private inference service.', 'The single inference service is unavailable; requests wait at the policy boundary.', 'Private inference returns and queued requests can proceed.'],
];

export function ArchitecturePlayground() {
  const { ref: presentationRef, step, held, reduced, running, interactionProps, progressKey, duration, select, resume } = usePresentation({ id: 'architecture', durations });
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const scenarioIndex = Math.floor(step / 5);
  const stage = step % 5;
  const scenario = architectureScenarios[scenarioIndex];
  let state = createInitialPlaygroundState(scenario.id);
  if (stage === 2) state = playgroundReducer(state, { type: 'set-load', loadMode: 'burst' });
  if (stage === 3) state = playgroundReducer(state, { type: 'pause-worker', workerId: scenario.workerIds[0] });
  const keyNode = [stage === 1 ? 'vector-store' : 'inference-a', stage === 1 ? 'worker-a' : 'kafka', stage === 1 ? 'policy' : 'private-inference'][scenarioIndex];

  const selectScenario = (index: number) => select(index * 5);
  const handleKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : null;
    if (next === null) return;
    event.preventDefault();
    selectScenario(next);
    tabs.current[next]?.focus();
  };

  return <section id="architecture" className="architecture-section architecture-showcase" aria-labelledby="architecture-title">
    <div className="section-heading">
      <p className="technical-label">02 / ARCHITECTURE IN MOTION</p>
      <h2 id="architecture-title">Inspect the system.<br /><em>See how it responds.</em></h2>
      <p>Private AI, resilient data platforms, and governed enterprise systems — from the first request to recovery.</p>
    </div>
    <div className="architecture-overview">
      {architectureScenarios.map((candidate, index) => <article key={candidate.id}>
        <p className="technical-label">0{index + 1}</p>
        <h3>{candidate.label}</h3>
        <p>{candidate.summary}</p>
      </article>)}
    </div>
    <div ref={presentationRef} className="architecture-presentation" data-testid="architecture-workbench" data-motion={reduced ? 'reduced' : 'full'} data-running={running} {...interactionProps}>
      <div className="scenario-tabs" role="tablist" aria-label="Architecture scenario">
        {architectureScenarios.map((candidate, index) => <button key={candidate.id} ref={(node) => { tabs.current[index] = node; }} type="button" role="tab" id={`scenario-tab-${candidate.id}`} aria-label={candidate.label} aria-selected={scenarioIndex === index} aria-controls="architecture-panel" tabIndex={scenarioIndex === index ? 0 : -1} onKeyDown={(event) => handleKey(event, index)} onClick={() => selectScenario(index)}>
          <span>0{index + 1}</span>{candidate.label}
        </button>)}
      </div>
      <div id="architecture-panel" role="tabpanel" aria-labelledby={`scenario-tab-${scenario.id}`}>
        <div className="architecture-stage">
          <div><p className="technical-label">{scenario.boundaryLabel} / {stage + 1} of 5</p><h3>{stageTitles[scenarioIndex][stage]}</h3></div>
          <p>{descriptions[scenarioIndex][stage]}</p>
        </div>
        <ArchitectureDiagram scenario={scenario} state={state} route={getActiveRoute(state)} keyNode={keyNode} running={running} />
        <div className="architecture-progress" aria-hidden="true"><span key={progressKey} style={{ animationDuration: `${duration}ms`, animationPlayState: running ? 'running' : 'paused' }} /></div>
      </div>
      <div className="architecture-caption"><p>{scenario.disclaimer}</p>{held && <button type="button" onClick={() => { tabs.current[scenarioIndex]?.focus({ preventScroll: true }); resume(); }}>Continue presentation</button>}</div>
    </div>
  </section>;
}
