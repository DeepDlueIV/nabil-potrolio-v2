import { architectureScenarios } from '@/data/architecture-scenarios';
import type { ArchitectureScenario } from '@/data/types';

export type LoadMode = 'normal' | 'burst';
export type DemoStatus = 'idle' | 'running' | 'rerouted' | 'queued' | 'complete';

export type PlaygroundState = {
  scenarioId: ArchitectureScenario['id'];
  selectedNodeId: string;
  loadMode: LoadMode;
  unavailableWorkerId: string | null;
  demoStatus: DemoStatus;
};

export type PlaygroundAction =
  | { type: 'select-scenario'; scenarioId: ArchitectureScenario['id'] }
  | { type: 'select-node'; nodeId: string }
  | { type: 'set-load'; loadMode: LoadMode }
  | { type: 'run-demo' }
  | { type: 'pause-worker'; workerId: string }
  | { type: 'complete-demo' }
  | { type: 'reset' };

export function getScenario(scenarioId: ArchitectureScenario['id']) {
  const scenario = architectureScenarios.find((candidate) => candidate.id === scenarioId);
  if (!scenario) throw new Error(`Unknown architecture scenario: ${scenarioId}`);
  return scenario;
}

export function createInitialPlaygroundState(scenarioId: ArchitectureScenario['id'] = 'private-rag'): PlaygroundState {
  const scenario = getScenario(scenarioId);
  return {
    scenarioId,
    selectedNodeId: scenario.nodes[0].id,
    loadMode: 'normal',
    unavailableWorkerId: null,
    demoStatus: 'idle',
  };
}

export function getActiveRoute(state: PlaygroundState) {
  const scenario = getScenario(state.scenarioId);
  if (!state.unavailableWorkerId || !scenario.normalRoute.includes(state.unavailableWorkerId)) return scenario.normalRoute;
  return scenario.fallbackRoute;
}

export function playgroundReducer(state: PlaygroundState, action: PlaygroundAction): PlaygroundState {
  switch (action.type) {
    case 'select-scenario':
      return createInitialPlaygroundState(action.scenarioId);
    case 'select-node':
      return { ...state, selectedNodeId: action.nodeId };
    case 'set-load':
      return { ...state, loadMode: action.loadMode };
    case 'run-demo': {
      const route = getActiveRoute(state);
      return { ...state, demoStatus: route.length ? (state.unavailableWorkerId ? 'rerouted' : 'running') : 'queued' };
    }
    case 'pause-worker': {
      const scenario = getScenario(state.scenarioId);
      const resuming = state.unavailableWorkerId === action.workerId;
      if (resuming) return { ...state, unavailableWorkerId: null, demoStatus: 'idle' };
      const unavailableWorkerId = action.workerId;
      const affectedRoute = scenario.normalRoute.includes(unavailableWorkerId);
      return {
        ...state,
        unavailableWorkerId,
        demoStatus: affectedRoute ? (scenario.fallbackRoute.length ? 'rerouted' : 'queued') : state.demoStatus,
      };
    }
    case 'complete-demo':
      return state.demoStatus === 'running' || state.demoStatus === 'rerouted' ? { ...state, demoStatus: 'complete' } : state;
    case 'reset':
      return createInitialPlaygroundState(state.scenarioId);
  }
}
