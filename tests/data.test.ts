import { describe, expect, it } from 'vitest';
import { profile, engagements } from '../data/profile';
import { technologies } from '../data/technologies';
import { architectureScenarios } from '../data/architecture-scenarios';

describe('verified portfolio content', () => {
  it('keeps the user-approved seven-year career span', () => {
    expect(profile.years).toBe(7);
    expect(profile.experience.map((role) => role.dates)).toEqual([
      '2021 — Present',
      '2021 — 2024',
      '2020 — 2021',
      '2019 — 2020',
    ]);
  });

  it('retains the complete sourced technology inventory', () => {
    const names = technologies.flatMap((group) => group.items.map((item) => item.name));
    expect(names).toEqual(expect.arrayContaining([
      'Python', 'Go', 'C++', 'Rust', 'TypeScript', 'CUDA', 'PyTorch',
      'Triton Inference Server', 'vLLM', 'TensorRT-LLM', 'Ray', 'LangChain',
      'Qdrant', 'Milvus', 'Redis', 'PostgreSQL', 'Apache Kafka', 'ClickHouse',
      'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'AWS', 'Bare-Metal',
      'Hetzner', 'OVH', 'Vault', 'OpenID Connect', 'Prometheus', 'Grafana',
      'ELK Stack', 'SOC 2', 'ISO 27001', 'GDPR',
    ]));
  });

  it('models three genuinely different architecture illustrations', () => {
    expect(architectureScenarios.map((scenario) => scenario.id)).toEqual([
      'private-rag', 'streaming-data', 'secure-ai',
    ]);
    expect(new Set(architectureScenarios.map((scenario) => scenario.nodes.map((node) => node.id).join('|'))).size).toBe(3);
    expect(architectureScenarios.every((scenario) => scenario.disclaimer.includes('not a live system or benchmark'))).toBe(true);
  });

  it('keeps contacts honest and excludes unsupported performance claims', () => {
    expect(profile.contacts).toEqual({ email: '', github: '', linkedin: '' });
    const serialized = JSON.stringify({ profile, engagements, technologies, architectureScenarios });
    expect(serialized).not.toMatch(/11\+|99\.99|sub-10|million|zero downtime|certified/i);
    expect(engagements).toHaveLength(3);
  });
});
