import { describe, expect, it } from 'vitest';
import { architectureScenarios } from '../data/architecture-scenarios';
import { createInitialPlaygroundState, getActiveRoute, playgroundReducer } from '../lib/architecture/playground-reducer';

describe('playgroundReducer', () => {
  it('resets incompatible state when the architecture scenario changes', () => {
    const busyState = {
      ...createInitialPlaygroundState('private-rag'),
      selectedNodeId: 'inference-b',
      loadMode: 'burst' as const,
      unavailableWorkerId: 'inference-a',
      demoStatus: 'running' as const,
    };

    expect(playgroundReducer(busyState, { type: 'select-scenario', scenarioId: 'streaming-data' })).toEqual({
      scenarioId: 'streaming-data', selectedNodeId: 'producers', loadMode: 'normal', unavailableWorkerId: null, demoStatus: 'idle',
    });
  });

  it('changes packet density without changing the logical route', () => {
    const initial = createInitialPlaygroundState('private-rag');
    const burst = playgroundReducer(initial, { type: 'set-load', loadMode: 'burst' });
    expect(burst.loadMode).toBe('burst');
    expect(getActiveRoute(initial)).toEqual(getActiveRoute(burst));
  });

  it('reroutes around an unavailable worker when redundancy exists', () => {
    const initial = playgroundReducer(createInitialPlaygroundState('private-rag'), { type: 'run-demo' });
    const failed = playgroundReducer(initial, { type: 'pause-worker', workerId: 'inference-a' });
    expect(failed.demoStatus).toBe('rerouted');
    expect(getActiveRoute(failed)).toEqual(['app', 'gateway', 'retrieval', 'vector-store', 'inference-b', 'app']);
  });

  it('queues work instead of inventing a route when the only worker is paused', () => {
    const initial = playgroundReducer(createInitialPlaygroundState('secure-ai'), { type: 'run-demo' });
    const failed = playgroundReducer(initial, { type: 'pause-worker', workerId: 'private-inference' });
    expect(failed.demoStatus).toBe('queued');
    expect(getActiveRoute(failed)).toEqual([]);
  });

  it('reset restores the current scenario configuration', () => {
    const scenario = architectureScenarios[1];
    const changed = playgroundReducer(
      { ...createInitialPlaygroundState(scenario.id), selectedNodeId: 'worker-b', loadMode: 'burst', demoStatus: 'complete' },
      { type: 'reset' },
    );
    expect(changed).toEqual(createInitialPlaygroundState('streaming-data'));
  });
});
