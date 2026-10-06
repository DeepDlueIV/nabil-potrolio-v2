'use client';

import { motion } from 'motion/react';
import { useEffect, useReducer, useRef } from 'react';
import { architectureScenarios } from '@/data/architecture-scenarios';
import type { ArchitectureScenario } from '@/data/types';
import { createInitialPlaygroundState, getActiveRoute, getScenario, playgroundReducer } from '@/lib/architecture/playground-reducer';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { useMotionPreference } from '../ui/MotionProvider';

function statusMessage(status: ReturnType<typeof createInitialPlaygroundState>['demoStatus'], scenario: ArchitectureScenario, unavailableWorkerId: string | null) {
  const worker = scenario.nodes.find((node) => node.id === unavailableWorkerId);
  const fallbackWorker = scenario.nodes.find((node) => node.id === scenario.fallbackRoute.find((id) => scenario.workerIds.includes(id)));
  switch (status) {
    case 'running': return 'Demo request is moving through the highlighted data path.';
    case 'rerouted': return `Worker paused; request rerouted through ${fallbackWorker?.label ?? 'the available worker'}.`;
    case 'queued': return `Request queued until ${worker?.label.toLowerCase() ?? 'the worker'} is available.`;
    case 'complete': return 'Demo flow complete. No live workload or benchmark was executed.';
    default: return 'Ready. Choose a scenario, inspect a node, or run the illustrative flow.';
  }
}

export function ArchitecturePlayground() {
  const [state, dispatch] = useReducer(playgroundReducer, undefined, () => createInitialPlaygroundState());
  const scenarioTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const { preference } = useMotionPreference();
  const reduced = preference === 'reduced';
  const scenario = getScenario(state.scenarioId);
  const route = getActiveRoute(state);
  const selectedNode = scenario.nodes.find((node) => node.id === state.selectedNodeId) ?? scenario.nodes[0];
  const worker = scenario.nodes.find((node) => node.id === scenario.workerIds[0]);

  useEffect(() => {
    if (state.demoStatus !== 'running' && state.demoStatus !== 'rerouted') return;
    const timer = window.setTimeout(() => dispatch({ type: 'complete-demo' }), 2200);
    return () => window.clearTimeout(timer);
  }, [state.demoStatus, state.scenarioId]);

  const selectScenario = (scenarioId: ArchitectureScenario['id']) => dispatch({ type: 'select-scenario', scenarioId });
  const handleScenarioKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const next = architectureScenarios[(index + offset + architectureScenarios.length) % architectureScenarios.length];
    selectScenario(next.id);
    scenarioTabs.current[(index + offset + architectureScenarios.length) % architectureScenarios.length]?.focus();
  };

  return (
    <section id="architecture" className="architecture-section" aria-labelledby="architecture-title">
      <div className="section-heading">
        <p className="technical-label">02 / ARCHITECTURE PLAYGROUND</p>
        <h2 id="architecture-title">Inspect the system.<br /><em>Change the conditions.</em></h2>
        <p>Three distinct, deterministic illustrations show how the paths change with the workload—not a dashboard with invented telemetry.</p>
      </div>

      <div className="scenario-tabs" role="tablist" aria-label="Architecture scenario">
        {architectureScenarios.map((candidate, index) => (
          <button
            key={candidate.id}
            ref={(node) => { scenarioTabs.current[index] = node; }}
            type="button"
            role="tab"
            aria-label={candidate.label}
            aria-selected={scenario.id === candidate.id}
            tabIndex={scenario.id === candidate.id ? 0 : -1}
            onKeyDown={(event) => handleScenarioKey(event, index)}
            onClick={() => selectScenario(candidate.id)}
          >
            <span>0{index + 1}</span>{candidate.label}
          </button>
        ))}
      </div>

      <motion.div
        className="architecture-workbench"
        data-testid="architecture-workbench"
        data-motion={reduced ? 'reduced' : 'full'}
        key={scenario.id}
        initial={reduced ? false : { opacity: .65, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : .42 }}
      >
        <div className="architecture-sidebar">
          <p className="technical-label">{scenario.eyebrow}</p>
          <h3>{scenario.label}</h3>
          <p>{scenario.summary}</p>
          <div className="node-inspector" role="status" aria-label="Selected architecture node">
            <span className="technical-label">{selectedNode.kind} / {selectedNode.label}</span>
            <p>{selectedNode.summary}</p>
            <small>{selectedNode.technologies.join(' · ')}</small>
          </div>
          <p className="architecture-disclaimer">{scenario.disclaimer}</p>
        </div>

        <div className="architecture-canvas">
          <ArchitectureDiagram scenario={scenario} state={state} route={route} onSelectNode={(nodeId) => dispatch({ type: 'select-node', nodeId })} />
          <div className="architecture-controls">
            <div className="load-control" aria-label="Illustrative load mode">
              {(['normal', 'burst'] as const).map((loadMode) => (
                <button key={loadMode} type="button" aria-pressed={state.loadMode === loadMode} onClick={() => dispatch({ type: 'set-load', loadMode })}>{loadMode[0].toUpperCase() + loadMode.slice(1)}</button>
              ))}
            </div>
            <button className="control-primary" type="button" onClick={() => dispatch({ type: 'run-demo' })}>{scenario.runLabel}</button>
            {worker && (
              <button className="control-failure" type="button" aria-pressed={state.unavailableWorkerId === worker.id} onClick={() => dispatch({ type: 'pause-worker', workerId: worker.id })}>
                {state.unavailableWorkerId === worker.id ? `Resume ${worker.label}` : `Pause ${worker.label}`}
              </button>
            )}
            <button type="button" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
          </div>
          <p className={`demo-status demo-status--${state.demoStatus}`} role="status" aria-label="Demo status">{statusMessage(state.demoStatus, scenario, state.unavailableWorkerId)}</p>
        </div>
      </motion.div>
    </section>
  );
}
