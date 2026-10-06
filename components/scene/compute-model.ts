export type SceneMode = 'assembled' | 'exploded';
export type ScenePhase = 'compute' | 'orchestration' | 'system';
export type SceneComponentId = 'accelerators' | 'fabric' | 'gateway' | 'data';

export const sceneComponents: Array<{
  id: SceneComponentId;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  { id: 'accelerators', label: 'Accelerator blades', shortLabel: 'GPU compute', description: 'Four accelerator blades represent parallel private inference capacity.' },
  { id: 'fabric', label: 'Interconnect fabric', shortLabel: 'Fabric', description: 'The fabric carries addressed work between compute, gateway, and data services.' },
  { id: 'gateway', label: 'Policy gateway', shortLabel: 'Gateway', description: 'The gateway establishes the entry boundary for identity, policy, and request routing.' },
  { id: 'data', label: 'Data layer', shortLabel: 'Data', description: 'The data layer supplies retrieval context and operational state without pretending every request traverses every store.' },
];

export const phaseCopy: Record<ScenePhase, { index: string; title: string; body: string }> = {
  compute: { index: '01', title: 'Compute', body: 'Private inference begins with deliberately placed GPU capacity and a serving runtime the team can operate.' },
  orchestration: { index: '02', title: 'Orchestration', body: 'Replicas, routing, and workload control turn isolated accelerators into a resilient compute plane.' },
  system: { index: '03', title: 'System', body: 'Data, identity, and observability reveal the whole operating boundary—not just the model at its center.' },
};
