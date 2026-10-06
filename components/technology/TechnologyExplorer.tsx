'use client';

import { useMemo, useState } from 'react';
import { technologies } from '@/data/technologies';
import type { TechnologyLayer } from '@/data/types';

const featured = new Set(['CUDA', 'vLLM', 'Kubernetes', 'Qdrant', 'Terraform', 'Vault']);
const layerOrder: Array<[TechnologyLayer, string]> = [
  ['application', 'Application'],
  ['identity', 'Identity'],
  ['retrieval', 'Retrieval'],
  ['streaming', 'Streaming'],
  ['data', 'Data'],
  ['inference', 'Inference'],
  ['orchestration', 'Orchestration'],
  ['provisioning', 'Provisioning'],
  ['observability', 'Observability'],
  ['language', 'Language'],
];

export function TechnologyExplorer() {
  const allTechnologies = useMemo(() => technologies.flatMap((group) => group.items), []);
  const [selectedName, setSelectedName] = useState('CUDA');
  const [showAll, setShowAll] = useState(false);
  const selected = allTechnologies.find((technology) => technology.name === selectedName) ?? allTechnologies[0];

  return (
    <section id="technology" className="technology-section" aria-labelledby="technology-title">
      <div className="section-heading technology-heading">
        <p className="technical-label">04 / TECHNOLOGY EXPLORER</p>
        <h2 id="technology-title">Tools placed where they do useful work.</h2>
        <p>Select a technology to trace its role through the system. The list is capability context, not a certification claim.</p>
      </div>

      <div className="technology-workbench">
        <div className="technology-groups">
          {technologies.map((group) => {
            const items = showAll ? group.items : group.items.filter((item) => featured.has(item.name));
            if (!items.length) return null;
            return (
              <section key={group.id} aria-labelledby={`technology-${group.id}`}>
                <div>
                  <p id={`technology-${group.id}`} className="technical-label">{group.label}</p>
                  <small>{group.description}</small>
                </div>
                <div className="technology-buttons">
                  {items.map((technology) => (
                    <button
                      type="button"
                      key={technology.name}
                      aria-pressed={technology.name === selected.name}
                      onClick={() => setSelectedName(technology.name)}
                    >
                      {technology.name}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
          <button className="technology-reveal" type="button" onClick={() => setShowAll((value) => !value)}>
            {showAll ? 'Show focused stack' : 'View all technologies'} <span aria-hidden="true">{showAll ? '−' : '+'}</span>
          </button>
        </div>

        <aside className="technology-inspector" aria-live="polite">
          <p className="technical-label">Selected capability</p>
          <h3>{selected.name}</h3>
          <p>{selected.purpose}</p>
          <div className="technology-layers" aria-label="Architecture layers">
            {layerOrder.map(([id, label], index) => (
              <span key={id} className={`technology-layer${selected.layers.includes(id) ? ' is-active' : ''}`}>
                <small>{String(index + 1).padStart(2, '0')}</small>{label}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
