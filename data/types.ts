export type ContactDetails = {
  email: string;
  github: string;
  linkedin: string;
};

export type ExperienceRole = {
  id: string;
  dates: string;
  title: string;
  organization: string;
  domain: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
};

export type ExpertiseArea = {
  id: string;
  title: string;
  problem: string;
  approach: string;
  tools: string[];
  diagram: 'compute' | 'pipeline' | 'boundary' | 'direction';
};

export type Engagement = {
  id: string;
  title: string;
  prompt: string;
  includes: string[];
  outcomes: string[];
};

export type TechnologyLayer = 'application' | 'identity' | 'inference' | 'retrieval' | 'streaming' | 'data' | 'orchestration' | 'provisioning' | 'observability' | 'language';

export type Technology = {
  name: string;
  purpose: string;
  layers: TechnologyLayer[];
};

export type TechnologyGroup = {
  id: string;
  label: string;
  description: string;
  items: Technology[];
};

export type ArchitectureNode = {
  id: string;
  label: string;
  kind: TechnologyLayer;
  summary: string;
  technologies: string[];
  x: number;
  y: number;
  worker?: boolean;
};

export type ArchitectureEdge = {
  id: string;
  from: string;
  to: string;
  kind: 'data' | 'control' | 'observability' | 'ingestion';
};

export type ArchitectureScenario = {
  id: 'private-rag' | 'streaming-data' | 'secure-ai';
  label: string;
  eyebrow: string;
  summary: string;
  boundaryLabel: string;
  runLabel: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  normalRoute: string[];
  fallbackRoute: string[];
  workerIds: string[];
  disclaimer: string;
};
