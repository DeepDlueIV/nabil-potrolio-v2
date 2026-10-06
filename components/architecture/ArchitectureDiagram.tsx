import type { ArchitectureScenario } from '@/data/types';
import type { PlaygroundState } from '@/lib/architecture/playground-reducer';

type ArchitectureDiagramProps = {
  scenario: ArchitectureScenario;
  state: PlaygroundState;
  route: string[];
  onSelectNode: (nodeId: string) => void;
};

function edgeIsActive(from: string, to: string, route: string[]) {
  return route.some((nodeId, index) => nodeId === from && route[index + 1] === to);
}

export function ArchitectureDiagram({ scenario, state, route, onSelectNode }: ArchitectureDiagramProps) {
  const nodeById = new Map(scenario.nodes.map((node) => [node.id, node]));

  return (
    <div
      className="architecture-map"
      data-testid="architecture-diagram"
      data-load={state.loadMode}
      data-status={state.demoStatus}
      data-route={route.join('>')}
    >
      <p className="architecture-boundary-label technical-label">{scenario.boundaryLabel}</p>
      <svg className="architecture-wires" viewBox="0 0 1000 600" aria-hidden="true">
        <defs>
          <pattern id={`map-grid-${scenario.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#7ee7f5" opacity=".15" />
          </pattern>
          <marker id={`arrow-${scenario.id}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="currentColor" />
          </marker>
        </defs>
        <rect x="1" y="1" width="998" height="598" rx="2" fill={`url(#map-grid-${scenario.id})`} stroke="#30414f" strokeDasharray="6 8" />
        {scenario.edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;
          const active = edgeIsActive(edge.from, edge.to, route) && state.demoStatus !== 'idle';
          return (
            <g key={edge.id} className={`architecture-edge architecture-edge--${edge.kind} ${active ? 'is-active' : ''}`}>
              <path d={`M${from.x * 10} ${from.y * 6} L${to.x * 10} ${to.y * 6}`} markerEnd={`url(#arrow-${scenario.id})`} />
              {active && Array.from({ length: state.loadMode === 'burst' ? 3 : 1 }, (_, index) => (
                <circle key={index} r="4" style={{ offsetPath: `path('M${from.x * 10} ${from.y * 6} L${to.x * 10} ${to.y * 6}')`, animationDelay: `${index * .22}s` }} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="architecture-nodes">
        {scenario.nodes.map((node, index) => {
          const selected = state.selectedNodeId === node.id;
          const unavailable = state.unavailableWorkerId === node.id;
          const activeRoute = route.includes(node.id) && state.demoStatus !== 'idle';
          return (
            <button
              key={node.id}
              type="button"
              className={`architecture-node ${selected ? 'is-selected' : ''} ${unavailable ? 'is-unavailable' : ''} ${activeRoute ? 'is-active-route' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              aria-label={`Inspect ${node.label}`}
              aria-pressed={selected}
              onClick={() => onSelectNode(node.id)}
            >
              <span className="architecture-node__index">{String(index + 1).padStart(2, '0')}</span>
              <span>{node.label}</span>
              <small>{unavailable ? 'Paused' : node.kind}</small>
            </button>
          );
        })}
      </div>
      <div className="edge-legend technical-label" aria-label="Connection legend">
        <span><i className="legend-line legend-line--data" />Data plane</span>
        <span><i className="legend-line legend-line--control" />Control</span>
        <span><i className="legend-line legend-line--observability" />Observability</span>
      </div>
    </div>
  );
}
