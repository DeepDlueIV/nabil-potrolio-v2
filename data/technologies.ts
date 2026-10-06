import type { TechnologyGroup } from './types';

export const technologies: TechnologyGroup[] = [
  { id: 'languages', label: 'Languages', description: 'Implementation choices matched to the performance boundary.', items: [
    { name: 'Python', purpose: 'AI systems and automation', layers: ['language', 'application'] },
    { name: 'Go', purpose: 'Concurrent services and infrastructure tooling', layers: ['language', 'application'] },
    { name: 'C++', purpose: 'Performance-critical system components', layers: ['language', 'inference'] },
    { name: 'Rust', purpose: 'Safe systems programming', layers: ['language', 'application'] },
    { name: 'TypeScript', purpose: 'Typed product and operations interfaces', layers: ['language', 'application'] },
  ] },
  { id: 'ai', label: 'AI / ML / Compute', description: 'From model runtime to distributed GPU execution.', items: [
    { name: 'CUDA', purpose: 'GPU compute and kernel execution', layers: ['inference'] },
    { name: 'PyTorch', purpose: 'Model development and execution', layers: ['inference'] },
    { name: 'Triton Inference Server', purpose: 'Production model serving', layers: ['inference'] },
    { name: 'vLLM', purpose: 'High-throughput LLM inference', layers: ['inference'] },
    { name: 'TensorRT-LLM', purpose: 'Optimized NVIDIA inference', layers: ['inference'] },
    { name: 'Ray', purpose: 'Distributed compute orchestration', layers: ['orchestration'] },
    { name: 'LangChain', purpose: 'Application-level LLM workflows', layers: ['application', 'retrieval'] },
  ] },
  { id: 'data', label: 'Data / Vector / Streaming', description: 'Retrieval, state, events, and analytics on distinct paths.', items: [
    { name: 'Qdrant', purpose: 'Vector retrieval for semantic context', layers: ['retrieval'] },
    { name: 'Milvus', purpose: 'Distributed vector storage and search', layers: ['retrieval'] },
    { name: 'Redis', purpose: 'Low-latency state and caching', layers: ['data'] },
    { name: 'PostgreSQL', purpose: 'Transactional relational storage', layers: ['data'] },
    { name: 'Apache Kafka', purpose: 'Durable event-streaming backbone', layers: ['streaming'] },
    { name: 'ClickHouse', purpose: 'High-throughput analytical storage', layers: ['data'] },
  ] },
  { id: 'infrastructure', label: 'Infrastructure', description: 'Reproducible deployment from cloud to bare metal.', items: [
    { name: 'Kubernetes', purpose: 'Workload and GPU orchestration', layers: ['orchestration'] },
    { name: 'Docker', purpose: 'Portable workload packaging', layers: ['orchestration'] },
    { name: 'Terraform', purpose: 'Versioned infrastructure provisioning', layers: ['provisioning'] },
    { name: 'Ansible', purpose: 'Configuration and fleet automation', layers: ['provisioning'] },
    { name: 'AWS', purpose: 'Managed cloud infrastructure', layers: ['provisioning'] },
    { name: 'Bare-Metal', purpose: 'Dedicated private compute', layers: ['provisioning', 'inference'] },
    { name: 'Hetzner', purpose: 'Bare-metal infrastructure option', layers: ['provisioning'] },
    { name: 'OVH', purpose: 'Bare-metal infrastructure option', layers: ['provisioning'] },
  ] },
  { id: 'security', label: 'Security / Observability', description: 'Identity, secrets, evidence, and audit context.', items: [
    { name: 'Vault', purpose: 'Secrets management', layers: ['identity'] },
    { name: 'OpenID Connect', purpose: 'Identity federation', layers: ['identity'] },
    { name: 'Prometheus', purpose: 'Metrics collection', layers: ['observability'] },
    { name: 'Grafana', purpose: 'Operational observability', layers: ['observability'] },
    { name: 'ELK Stack', purpose: 'Centralized logs and analysis', layers: ['observability'] },
    { name: 'SOC 2', purpose: 'Audit-readiness context, not a claimed certification', layers: ['observability'] },
    { name: 'ISO 27001', purpose: 'Security-management audit context', layers: ['observability'] },
    { name: 'GDPR', purpose: 'Privacy and data-sovereignty context', layers: ['identity', 'observability'] },
  ] },
];
