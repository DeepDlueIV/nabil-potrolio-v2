import { architectureScenarios } from '@/data/architecture-scenarios';
import type { ArchitectureScenario } from '@/data/types';

export type LoadMode = 'normal' | 'burst';
export type DemoStatus = 'running' | 'rerouted' | 'queued';

export type PlaygroundState = {
  scenarioId: ArchitectureScenario['id'];
  loadMode: LoadMode;
  unavailableWorkerId: string | null;
  demoStatus: DemoStatus;
};

export type PlaygroundAction =
  | { type: 'select-scenario'; scenarioId: ArchitectureScenario['id'] }
  | { type: 'set-load'; loadMode: LoadMode }
  | { type: 'pause-worker'; workerId: string }
  | { type: 'reset' };

export function getScenario(scenarioId: ArchitectureScenario['id']) {
  const scenario = architectureScenarios.find((candidate) => candidate.id === scenarioId);
  if (!scenario) throw new Error(`Unknown architecture scenario: ${scenarioId}`);
  return scenario;
}

export function createInitialPlaygroundState(scenarioId: ArchitectureScenario['id'] = 'private-rag'): PlaygroundState {
  getScenario(scenarioId);
  return {
    scenarioId,
    loadMode: 'normal',
    unavailableWorkerId: null,
    demoStatus: 'running',
  };
}

export function getActiveRoute(state: PlaygroundState) {
  const scenario = getScenario(state.scenarioId);
  if (!state.unavailableWorkerId || !scenario.normalRoute.includes(state.unavailableWorkerId)) return scenario.normalRoute;
  return scenario.fallbackRoute.length ? scenario.fallbackRoute : scenario.normalRoute.slice(0, scenario.normalRoute.indexOf(state.unavailableWorkerId));
}

export function playgroundReducer(state: PlaygroundState, action: PlaygroundAction): PlaygroundState {
  switch (action.type) {
    case 'select-scenario':
      return createInitialPlaygroundState(action.scenarioId);
    case 'set-load':
      return { ...state, loadMode: action.loadMode };
    case 'pause-worker': {
      const scenario = getScenario(state.scenarioId);
      const resuming = state.unavailableWorkerId === action.workerId;
      if (resuming) return { ...state, unavailableWorkerId: null, demoStatus: 'running' };
      const unavailableWorkerId = action.workerId;
      const affectedRoute = scenario.normalRoute.includes(unavailableWorkerId);
      return {
        ...state,
        unavailableWorkerId,
        demoStatus: affectedRoute ? (scenario.fallbackRoute.length ? 'rerouted' : 'queued') : state.demoStatus,
      };
    }
    case 'reset':
      return createInitialPlaygroundState(state.scenarioId);
  }
}
