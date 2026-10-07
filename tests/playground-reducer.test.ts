import { describe, expect, it } from 'vitest';
import { architectureScenarios } from '../data/architecture-scenarios';
import { createInitialPlaygroundState, getActiveRoute, playgroundReducer } from '../lib/architecture/playground-reducer';

describe('architecture routes', () => {
  it('starts with available inference and restores it after failure', () => {
    const initial = createInitialPlaygroundState('private-rag');
    expect(initial.demoStatus).toBe('running');
    const failed = playgroundReducer(initial, { type: 'pause-worker', workerId: 'inference-a' });
    expect(failed.demoStatus).toBe('rerouted');
    expect(getActiveRoute(failed)).toContain('inference-b');
    const restored = playgroundReducer(failed, { type: 'pause-worker', workerId: 'inference-a' });
    expect(restored.demoStatus).toBe('running');
    expect(getActiveRoute(restored)).toContain('inference-a');
  });

  it('has a real drawn edge for every online route hop', () => {
    for (const scenario of architectureScenarios) {
      for (const route of [scenario.normalRoute, scenario.fallbackRoute]) {
        for (let index = 0; index < route.length - 1; index++) {
          expect(scenario.edges.some((edge) => edge.from === route[index] && edge.to === route[index + 1] && edge.kind === 'data')).toBe(true);
        }
        expect(route).not.toContain('ingestion');
        expect(route).not.toContain('provisioning');
      }
    }
  });

  it('queues at the policy boundary when secure inference is unavailable', () => {
    const initial = createInitialPlaygroundState('secure-ai');
    const failed = playgroundReducer(initial, { type: 'pause-worker', workerId: 'private-inference' });
    expect(failed.demoStatus).toBe('queued');
    expect(getActiveRoute(failed)).toEqual(['enterprise-user', 'identity', 'policy']);
  });

  it('resets incompatible state on scenario selection and preserves routing under burst', () => {
    const initial = createInitialPlaygroundState();
    const burst = playgroundReducer(initial, { type: 'set-load', loadMode: 'burst' });
    expect(getActiveRoute(burst)).toEqual(getActiveRoute(initial));
    const changed = playgroundReducer(burst, { type: 'select-scenario', scenarioId: 'streaming-data' });
    expect(changed.loadMode).toBe('normal');
    expect(changed.demoStatus).toBe('running');
    expect(changed.unavailableWorkerId).toBeNull();
  });
});
