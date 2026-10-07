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
  const { ref: presentationRef, step, held, reduced, running, active, pageVisible, interactionProps, progress, select, resume, pause } = usePresentation({ id: 'architecture', durations });
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const scenarioIndex = Math.floor(step / 5);
  const stage = step % 5;
  const scenario = architectureScenarios[scenarioIndex];
  let state = createInitialPlaygroundState(scenario.id);
  if (stage === 2) state = playgroundReducer(state, { type: 'set-load', loadMode: 'burst' });
  if (stage === 3) state = playgroundReducer(state, { type: 'pause-worker', workerId: scenario.workerIds[0] });
  const keyNode = [stage === 1 ? 'vector-store' : 'inference-a', stage === 1 ? 'worker-a' : 'kafka', stage === 1 ? 'policy' : 'private-inference'][scenarioIndex];
  const selectedNode = scenario.nodes.find((node) => node.id === keyNode)!;

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
      <h2 id="architecture-title">Inspect the system.<br /><em>Change the conditions.</em></h2>
      <p>Private AI, resilient data platforms, and governed enterprise systems — from the first request to recovery.</p>
    </div>
    <div ref={presentationRef} className="architecture-presentation" data-testid="architecture-workbench" data-motion={reduced ? 'reduced' : 'full'} data-running={running} {...interactionProps}>
      <div className="architecture-navigation">
      <div className="scenario-tabs" role="tablist" aria-label="Architecture scenario">
        {architectureScenarios.map((candidate, index) => <button key={candidate.id} ref={(node) => { tabs.current[index] = node; }} type="button" role="tab" id={`scenario-tab-${candidate.id}`} aria-label={candidate.label} aria-selected={scenarioIndex === index} aria-controls="architecture-panel" tabIndex={scenarioIndex === index ? 0 : -1} onKeyDown={(event) => handleKey(event, index)} onClick={() => selectScenario(index)}>
          <span>0{index + 1}</span>{candidate.label}
        </button>)}
      </div>
      <button className="architecture-playback" data-presentation-playback type="button" aria-label={held ? 'Resume architecture presentation' : 'Pause architecture presentation'} aria-pressed={!held && !reduced} onClick={held ? resume : pause}><span aria-hidden="true">{held ? '▶' : 'Ⅱ'}</span></button>
      </div>
      <div className="architecture-workbench" id="architecture-panel" role="tabpanel" aria-labelledby={`scenario-tab-${scenario.id}`}>
        <div className="architecture-sidebar">
          <p className="technical-label">{scenario.eyebrow}</p>
          <h3>{scenario.label}</h3>
          <p>{scenario.summary}</p>
          <div className="node-inspector">
            <span className="technical-label">{selectedNode.kind} / {selectedNode.label}</span>
            <p>{selectedNode.summary}</p>
            <small>{selectedNode.technologies.join(' · ')}</small>
          </div>
          <p className="architecture-disclaimer">{scenario.disclaimer}</p>
        </div>
        <div className="architecture-canvas">
        <ArchitectureDiagram scenario={scenario} state={state} route={getActiveRoute(state)} keyNode={keyNode} running={active && pageVisible && !reduced} />
        <div className="architecture-stage">
          <div><p className="technical-label">{stage + 1} / 5</p><h4>{stageTitles[scenarioIndex][stage]}</h4></div>
          <p>{descriptions[scenarioIndex][stage]}</p>
        </div>
        <div className="architecture-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
        </div>
      </div>
    </div>
  </section>;
}
