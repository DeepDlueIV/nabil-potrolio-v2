'use client';

import type { CSSProperties } from 'react';
import { technologies } from '@/data/technologies';
import { usePresentation } from '@/components/presentation/usePresentation';
import styles from './TechnologyExplorer.module.css';

const groups = [
  { id: 'compute', label: 'Compute', context: 'Models & GPU execution' },
  { id: 'data', label: 'Data & streaming', context: 'Events & semantic context' },
  { id: 'infrastructure', label: 'Infrastructure', context: 'Workloads & provisioning' },
  { id: 'security', label: 'Security & observability', context: 'Access & operational evidence' },
] as const;

// Каждый инструмент показывает самостоятельное действие, а не обязательную зависимость от соседнего.
const frames = [
  { tool: 'vLLM', action: 'Serve a model', path: ['Request', 'Model runtime', 'Response'], explanation: 'vLLM serves language-model requests through a runtime designed for high-throughput inference.' },
  { tool: 'CUDA', action: 'Execute on the GPU', path: ['Tensors', 'GPU kernels', 'Results'], explanation: 'CUDA executes compute kernels on NVIDIA GPUs for performance-critical model workloads.' },
  { tool: 'Apache Kafka', action: 'Carry durable events', path: ['Producer', 'Event stream', 'Consumer'], explanation: 'Apache Kafka carries durable event streams between producers and independent consumers.' },
  { tool: 'Qdrant', action: 'Retrieve relevant context', path: ['Query vector', 'Vector search', 'Context'], explanation: 'Qdrant searches vectors to retrieve relevant semantic context for an application.' },
  { tool: 'Kubernetes', action: 'Place a workload', path: ['Workload', 'Scheduler', 'Compute node'], explanation: 'Kubernetes schedules workloads onto available infrastructure, including GPU resources.' },
  { tool: 'Terraform', action: 'Provision infrastructure', path: ['Definition', 'Plan & apply', 'Infrastructure'], explanation: 'Terraform turns versioned infrastructure definitions into reproducible provisioning plans.' },
  { tool: 'Vault', action: 'Control secret access', path: ['Identity', 'Access policy', 'Secret'], explanation: 'Vault applies access policies to keep application secrets behind an explicit security boundary.' },
  { tool: 'Prometheus', action: 'Collect operational signals', path: ['Service metrics', 'Collection', 'Time series'], explanation: 'Prometheus collects service metrics as time series for operational visibility.' },
];
const durations = frames.map(() => 4500);

export function TechnologyExplorer() {
  const { ref: showcaseRef, step, running, source, interactionProps, progressKey, duration, select, held, resume } =
    usePresentation({ id: 'technology', durations, pauseOnHover: true });
  const frame = frames[step];
  const groupIndex = Math.floor(step / 2);

  return (
    <section id="technology" className="technology-section" aria-labelledby="technology-title">
      <div className="section-heading technology-heading">
        <p className="technical-label">04 / TECHNOLOGY</p>
        <h2 id="technology-title">Tools placed where they do useful work.</h2>
        <p>From model execution to secure operations, each tool has a distinct role in the system.</p>
      </div>
      <div className={styles.layout}>
        <figure ref={showcaseRef} className={styles.showcase} aria-label="Technology purpose presentation"
          data-running={running} data-source={source} {...interactionProps}>
          <p className={`technical-label ${styles.eyebrow}`}>Where the tools work</p>
          <div className={styles.layers} aria-label="System capabilities">
            {groups.map((group, index) => (
              <div key={group.id} className={`${styles.layer} ${index === groupIndex ? styles.activeLayer : ''}`}>
                <span>{group.label}</span>
                <strong>{index === groupIndex ? frame.action : group.context}</strong>
              </div>
            ))}
          </div>
          <figcaption className={styles.caption}>
            <h3>{frame.tool}</h3>
            <p>{frame.explanation}</p>
          </figcaption>
          <ol className={styles.path} aria-label={`${frame.tool} purpose path`}>
            {frame.path.map((node) => <li key={node}>{node}</li>)}
          </ol>
          <div className={styles.progress} aria-hidden="true">
            <span key={progressKey} style={{ '--step-duration': `${duration}ms` } as CSSProperties} />
          </div>
          <nav className={styles.navigation} aria-label="Technology presentation groups">
            {groups.map((group, index) => (
              <button key={group.id} type="button" aria-pressed={index === groupIndex} onClick={() => select(index * 2)}>{group.label}</button>
            ))}
          </nav>
          <div className={styles.continuation}>
            {held && <button type="button" onClick={resume}>Continue presentation <span aria-hidden="true">→</span></button>}
          </div>
          <p className={styles.note}>Illustrative tool roles within a system.</p>
        </figure>
        <section className={styles.stack} aria-label="Complete technology stack">
          {technologies.map((group) => (
            <div key={group.id} className={styles.stackGroup}>
              <h3>{group.label}</h3>
              <p>{group.description}</p>
              <ul>{group.items.map((technology) => (
                <li key={technology.name}><strong>{technology.name}</strong> — {technology.purpose}</li>
              ))}</ul>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
