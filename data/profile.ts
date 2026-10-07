import type { Engagement, ExpertiseArea, ExperienceRole } from './types';

/** Edit verified personal details here. Presentation code reads from this module. */
export const profile: {
  name: string;
  title: string;
  secondaryTitle: string;
  location: string;
  availability: string;
  years: number;
  portrait: { src: string; alt: string; objectPosition: string } | null;
  description: string;
  contacts: { email: string; github: string; linkedin: string };
  languages: string[];
  experience: ExperienceRole[];
} = {
  name: 'Nabil Rakdani',
  title: 'Principal AI & High-Performance Systems Architect',
  secondaryTitle: 'Fractional CTO',
  location: 'Pavia, Italy',
  availability: 'Global B2B engagements',
  years: 7,
  portrait: { src: '/images/nabil-portrait.webp', alt: 'Nabil Rakdani beside a GPU rig', objectPosition: '50% 38%' },
  description: 'Designing, scaling, and securing enterprise-grade AI infrastructure, distributed GPU clusters, and high-throughput systems.',
  // Keep empty until genuine contact details are supplied. Never link to fabricated profiles.
  contacts: { email: '', github: '', linkedin: '' },
  languages: ['Italian / Native', 'English / Fluent', 'French / Professional'],
  experience: [
    {
      id: 'principal', dates: '2021 — Present', title: 'Independent Principal Architect & Fractional CTO', organization: 'Independent Contractor / Consultant', domain: 'Private AI platforms & technical leadership',
      description: 'Architectural direction and AI infrastructure consulting for high-tech enterprises and growth-stage companies.',
      responsibilities: ['Design greenfield private AI platforms', 'Shape distributed compute clusters', 'Guide high-throughput service architecture'],
      technologies: ['Kubernetes', 'CUDA', 'vLLM', 'Terraform'], image: '/images/experience-datacenter.webp', imageAlt: 'AI-generated editorial photograph of server infrastructure; not a client site', imagePosition: '50% 48%',
    },
    {
      id: 'lead', dates: '2021 — 2024', title: 'Lead Solutions Architect — AI & High-Performance Cloud', organization: 'Enterprise Advisory Services', domain: 'Cloud, data & security strategy',
      description: 'Directed cloud and data infrastructure strategy for European enterprise clients across AWS and bare-metal environments.',
      responsibilities: ['Lead security and architecture audits', 'Integrate production MLOps systems', 'Redesign infrastructure cost profiles'],
      technologies: ['AWS', 'Bare-Metal', 'MLOps', 'Vault'], image: '/images/experience-network.webp', imageAlt: 'AI-generated editorial photograph of network infrastructure; not an employer facility', imagePosition: '52% 44%',
    },
    {
      id: 'senior', dates: '2020 — 2021', title: 'Senior Infrastructure & DevOps Engineer', organization: 'European Tech Infrastructure Provider', domain: 'Reliability, scale & delivery',
      description: 'Managed stability and scaling for infrastructure handling heavy real-time data flows.',
      responsibilities: ['Automate CI/CD pipelines', 'Containerize legacy systems', 'Establish DevSecOps practices'],
      technologies: ['Docker', 'Kubernetes', 'Kafka', 'Prometheus'], image: '/images/experience-systems.webp', imageAlt: 'AI-generated editorial photograph of computing equipment; not a client project', imagePosition: '50% 50%',
    },
    {
      id: 'systems', dates: '2019 — 2020', title: 'Full-Stack Systems Engineer', organization: 'HPC & Low-Latency Systems', domain: 'Performance from first principles',
      description: 'Developed execution modules, low-latency data connectors, and high-performance system components.',
      responsibilities: ['Build execution modules', 'Develop low-latency data connectors', 'Engineer performance-critical components'],
      technologies: ['C++', 'Go', 'Redis', 'PostgreSQL'], image: '/images/experience-hardware.webp', imageAlt: 'AI-generated editorial photograph of electronic hardware; not an employer product', imagePosition: '50% 55%',
    },
  ]
};

export const expertise: ExpertiseArea[] = [
  { id: 'compute', title: 'Enterprise AI Infrastructure & GPU Orchestration', problem: 'Move private AI from an impressive prototype to an operable production platform.', approach: 'Design GPU-aware clusters, parallel inference, and controlled MLOps paths around the model.', tools: ['Kubernetes', 'NVIDIA A100 / H100', 'Triton', 'vLLM', 'TensorRT-LLM'], diagram: 'compute' },
  { id: 'data', title: 'High-Performance Data Pipelines & Vector Systems', problem: 'Keep high-volume events and retrieval context moving without hiding bottlenecks.', approach: 'Separate ingestion, processing, analytical storage, retrieval, and serving into observable paths.', tools: ['Kafka', 'Ray', 'Qdrant', 'Milvus', 'ClickHouse'], diagram: 'pipeline' },
  { id: 'security', title: 'Cloud Infrastructure & Zero-Trust Security', problem: 'Run sensitive AI workloads without surrendering data control or auditability.', approach: 'Build explicit trust boundaries, reproducible infrastructure, identity, secrets, and observability.', tools: ['Terraform', 'Ansible', 'Vault', 'OpenID Connect', 'Prometheus'], diagram: 'boundary' },
  { id: 'leadership', title: 'Strategic Technical Leadership & Fractional CTO', problem: 'Turn a complicated system and competing priorities into a defensible technical direction.', approach: 'Connect architecture audits, due diligence, cost constraints, roadmaps, and engineering leadership.', tools: ['Architecture advisory', 'Technical due diligence', 'Cost redesign', 'Roadmaps'], diagram: 'direction' },
];

export const engagements: Engagement[] = [
  { id: 'fractional-cto', title: 'Fractional CTO & Strategic Advisory', prompt: 'When leadership needs an experienced technical counterpart for a consequential decision.', includes: ['Architecture and technical-debt assessment', 'AI transformation roadmap', 'Technical due diligence', 'Security and audit preparation'], outcomes: ['A prioritized technical direction', 'Decision-ready architecture options', 'An execution roadmap to discuss'] },
  { id: 'ai-infrastructure', title: 'AI Infrastructure & GPU Cluster Engineering', prompt: 'When a private AI workload must move from prototype to an environment the team can operate.', includes: ['Private inference architecture', 'GPU cluster and serving design', 'Vector retrieval and data paths', 'MLOps and observability model'], outcomes: ['A target platform architecture', 'A staged infrastructure plan', 'Operational requirements to validate'] },
  { id: 'architecture-audit', title: 'High-Load Architecture Audit & Cost Redesign', prompt: 'When throughput, reliability, or cloud and GPU spend has become a constraint.', includes: ['Bottleneck and failure-point review', 'Workload and dependency mapping', 'Cloud / GPU cost structure analysis', 'Remediation sequencing'], outcomes: ['A risk and constraint map', 'Prioritized redesign options', 'A remediation roadmap to discuss'] },
];
