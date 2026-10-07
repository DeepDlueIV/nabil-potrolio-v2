import type { CSSProperties } from 'react';
import type { ArchitectureScenario } from '@/data/types';
import type { PlaygroundState } from '@/lib/architecture/playground-reducer';

type ArchitectureDiagramProps = { scenario: ArchitectureScenario; state: PlaygroundState; route: string[]; keyNode: string; running: boolean };

const mobilePositions: Record<ArchitectureScenario['id'], Record<string, [number, number]>> = {
  'private-rag': { app: [90, 60], gateway: [270, 60], retrieval: [90, 210], 'vector-store': [270, 210], 'inference-a': [90, 370], 'inference-b': [270, 370], ingestion: [270, 530], observability: [90, 530] },
  'streaming-data': { producers: [90, 60], kafka: [270, 60], 'worker-a': [90, 210], 'worker-b': [270, 210], redis: [90, 370], clickhouse: [270, 370], consumers: [90, 530], 'stream-signals': [270, 530] },
  'secure-ai': { 'enterprise-user': [90, 60], identity: [270, 60], policy: [90, 210], 'private-inference': [270, 210], 'private-data': [270, 370], response: [90, 370], provisioning: [270, 530], audit: [90, 530] },
};

export function ArchitectureDiagram({ scenario, state, route, keyNode, running }: ArchitectureDiagramProps) {
  return <div className="architecture-flow" data-testid="architecture-diagram" data-load={state.loadMode} data-status={state.demoStatus} data-route={route.join('>')} data-running={running}>
    {(['desktop', 'mobile'] as const).map((layout) => {
      const mobile = layout === 'mobile';
      const positions = new Map(scenario.nodes.map((node) => [node.id, mobile ? mobilePositions[scenario.id][node.id] : [node.x * 10, node.y * 6]]));
      const marker = `flow-arrow-${scenario.id}-${layout}`;
      return <svg key={layout} className={`architecture-flow__${layout}`} viewBox={mobile ? '0 0 360 600' : '0 0 1000 600'} aria-label={`${scenario.label}: ${state.demoStatus === 'queued' ? 'requests wait for inference' : 'highlighted request and response path'}`} role="img">
        <defs><marker id={marker} viewBox="0 0 8 8" markerWidth="7" markerHeight="7" refX="6" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8" fill="context-stroke" /></marker></defs>
        {scenario.edges.map((edge) => {
          const from = positions.get(edge.from)!;
          const to = positions.get(edge.to)!;
          const routeIndex = route.findIndex((id, index) => id === edge.from && route[index + 1] === edge.to);
          const active = routeIndex !== -1;
          const returning = edge.id.startsWith('return-') || edge.id.startsWith('context-');
          const bend = [(from[0] + to[0]) / 2, Math.max(from[1], to[1]) + (mobile ? 60 : 100)];
          // Заканчиваем линию перед карточкой, чтобы стрелка направления оставалась видимой.
          const towards = returning ? bend : from;
          const dx = towards[0] - to[0];
          const dy = towards[1] - to[1];
          const clip = Math.min((mobile ? 76 : 88) / Math.max(Math.abs(dx), 1), 38 / Math.max(Math.abs(dy), 1));
          const end = [to[0] + dx * clip, to[1] + dy * clip];
          const d = returning ? `M${from[0]} ${from[1]} Q${bend[0]} ${bend[1]} ${end[0]} ${end[1]}` : `M${from[0]} ${from[1]} L${end[0]} ${end[1]}`;
          return <g key={edge.id} className={`flow-edge flow-edge--${edge.kind}${active ? ' is-active' : ''}${returning ? ' is-return' : ''}`}>
            <path d={d} markerEnd={`url(#${marker})`} />
            {active && Array.from({ length: state.loadMode === 'burst' ? 3 : 1 }, (_, index) => <circle key={index} r={mobile ? 3 : 4} style={{ offsetPath: `path('${d}')`, animationDelay: `${routeIndex * .26 + index * .12}s` } as CSSProperties} />)}
          </g>;
        })}
        {scenario.nodes.map((node) => {
          const position = positions.get(node.id)!;
          const unavailable = state.unavailableWorkerId === node.id;
          const supporting = ['observability', 'provisioning'].includes(node.kind) || node.id === 'ingestion';
          return <foreignObject key={node.id} x={position[0] - (mobile ? 70 : 82)} y={position[1] - 31} width={mobile ? 140 : 164} height="74">
            <div className={`flow-node${route.includes(node.id) ? ' is-active' : ''}${keyNode === node.id ? ' is-key' : ''}${unavailable ? ' is-unavailable' : ''}${supporting ? ' is-supporting' : ''}`}>
              <span>{node.label}</span><small>{unavailable ? 'Unavailable' : node.worker ? 'Available' : node.id === 'ingestion' ? 'Separate indexing' : supporting ? 'Supporting plane' : node.kind}</small>
            </div>
          </foreignObject>;
        })}
      </svg>;
    })}
    <div className="architecture-flow-legend" aria-label="Connection legend"><span>Request / events</span><span>Context / response</span><span>Control / signals / ingestion</span></div>
  </div>;
}
