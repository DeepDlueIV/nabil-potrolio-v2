export type ScenePhase = 'system' | 'inside' | 'flow' | 'return';

export const heroPlaybackRate = 2;
export const heroDurations = [4000, 6000, 6000, 4000].map(duration => duration / heroPlaybackRate);
export const heroPhases: ScenePhase[] = ['system', 'inside', 'flow', 'return'];
export const phaseCopy: Record<ScenePhase, { title: string; body: string }> = {
  system: { title: 'System', body: 'Private AI infrastructure.' },
  inside: { title: 'Inside', body: 'GPU compute and high-speed connections.' },
  flow: { title: 'Data flow', body: 'Requests, context, inference, response.' },
  return: { title: 'System', body: 'Private AI infrastructure. Ready for the next request.' },
};

// Общий маршрут проходит по кабелю, портам, хранилищу и вычислительному лотку.
export const requestRoute: [number, number, number][] = [
  [-3.6, 1.42, 1.75], [-2.6, 1.42, 1.75], [-2.45, 1.42, 1.62],
  [-1.55, 1.42, 1.78], [-2.35, -1.25, 1.9], [.75, -1.25, 1.85],
  [.75, .12, 3.35], [.75, .24, 3.35], [-.75, .24, 3.35],
];
