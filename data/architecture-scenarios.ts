import type { ArchitectureScenario } from './types';

const disclaimer = 'Illustrative architecture — not a live system or benchmark';

export const architectureScenarios: ArchitectureScenario[] = [
  {
    id: 'private-rag', label: 'Private LLM / RAG', eyebrow: '01 / RETRIEVAL + INFERENCE', boundaryLabel: 'Private AI boundary', runLabel: 'Send demo request',
    summary: 'Retrieve relevant context from a vector store, pass it to private GPU inference, and return a grounded response. Ingestion updates the index separately.', disclaimer,
    nodes: [
      { id: 'app', label: 'Application', kind: 'application', summary: 'Owns the user request and receives the composed answer.', technologies: ['TypeScript', 'Python'], x: 10, y: 42 },
      { id: 'gateway', label: 'API gateway', kind: 'identity', summary: 'Authenticates and routes requests into the private platform.', technologies: ['OpenID Connect', 'Vault'], x: 30, y: 42 },
      { id: 'retrieval', label: 'Retrieval', kind: 'retrieval', summary: 'Finds relevant context without forcing ingestion into the request path.', technologies: ['Qdrant', 'Milvus', 'LangChain'], x: 50, y: 25 },
      { id: 'inference-a', label: 'Inference A', kind: 'inference', summary: 'Serves the model on a GPU-backed runtime.', technologies: ['vLLM', 'Triton Inference Server', 'CUDA'], x: 70, y: 35, worker: true },
      { id: 'inference-b', label: 'Inference B', kind: 'inference', summary: 'Provides a second illustrative worker for rerouting.', technologies: ['TensorRT-LLM', 'PyTorch'], x: 70, y: 65, worker: true },
      { id: 'vector-store', label: 'Vector store', kind: 'data', summary: 'Stores searchable embeddings used by retrieval.', technologies: ['Qdrant', 'Milvus'], x: 48, y: 76 },
      { id: 'ingestion', label: 'Ingestion', kind: 'streaming', summary: 'Updates the vector store on a path separate from live requests.', technologies: ['Python', 'Apache Kafka'], x: 26, y: 82 },
      { id: 'observability', label: 'Signals', kind: 'observability', summary: 'Collects metrics and logs across the platform.', technologies: ['Prometheus', 'Grafana', 'ELK Stack'], x: 89, y: 50 },
    ],
    edges: [
      { id: 'app-gateway', from: 'app', to: 'gateway', kind: 'data' }, { id: 'gateway-retrieval', from: 'gateway', to: 'retrieval', kind: 'data' },
      { id: 'retrieval-vector', from: 'retrieval', to: 'vector-store', kind: 'data' }, { id: 'retrieval-a', from: 'retrieval', to: 'inference-a', kind: 'data' },
      { id: 'context-retrieval', from: 'vector-store', to: 'retrieval', kind: 'data' },
      { id: 'return-a', from: 'inference-a', to: 'gateway', kind: 'data' }, { id: 'return-b', from: 'inference-b', to: 'gateway', kind: 'data' },
      { id: 'return-app', from: 'gateway', to: 'app', kind: 'data' },
      { id: 'retrieval-b', from: 'retrieval', to: 'inference-b', kind: 'data' }, { id: 'ingestion-vector', from: 'ingestion', to: 'vector-store', kind: 'ingestion' },
      { id: 'a-signals', from: 'inference-a', to: 'observability', kind: 'observability' }, { id: 'b-signals', from: 'inference-b', to: 'observability', kind: 'observability' },
    ],
    normalRoute: ['app', 'gateway', 'retrieval', 'vector-store', 'retrieval', 'inference-a', 'gateway', 'app'], fallbackRoute: ['app', 'gateway', 'retrieval', 'vector-store', 'retrieval', 'inference-b', 'gateway', 'app'], workerIds: ['inference-a', 'inference-b'],
  },
  {
    id: 'streaming-data', label: 'Streaming Data Platform', eyebrow: '02 / EVENT PROCESSING', boundaryLabel: 'Data platform boundary', runLabel: 'Run demo flow',
    summary: 'Producers publish events to a durable backbone; distributed workers transform them for operational state, analytics, and consumers.', disclaimer,
    nodes: [
      { id: 'producers', label: 'Producers', kind: 'application', summary: 'Applications and devices emit domain events.', technologies: ['Go', 'TypeScript'], x: 10, y: 50 },
      { id: 'kafka', label: 'Kafka', kind: 'streaming', summary: 'Decouples producers from processing and absorbs burst load.', technologies: ['Apache Kafka'], x: 29, y: 50 },
      { id: 'worker-a', label: 'Worker A', kind: 'orchestration', summary: 'Processes a partition of the stream.', technologies: ['Ray', 'Python'], x: 50, y: 32, worker: true },
      { id: 'worker-b', label: 'Worker B', kind: 'orchestration', summary: 'Provides a redundant processing route.', technologies: ['Ray', 'Go'], x: 50, y: 68, worker: true },
      { id: 'redis', label: 'Live state', kind: 'data', summary: 'Keeps low-latency operational state.', technologies: ['Redis'], x: 72, y: 28 },
      { id: 'clickhouse', label: 'Analytics', kind: 'data', summary: 'Stores processed events for analytical queries.', technologies: ['ClickHouse'], x: 72, y: 60 },
      { id: 'consumers', label: 'Consumers', kind: 'application', summary: 'Products and operators use the processed output.', technologies: ['TypeScript', 'PostgreSQL'], x: 90, y: 48 },
      { id: 'stream-signals', label: 'Signals', kind: 'observability', summary: 'Makes lag, worker health, and throughput inspectable.', technologies: ['Prometheus', 'Grafana'], x: 50, y: 90 },
    ],
    edges: [
      { id: 'p-k', from: 'producers', to: 'kafka', kind: 'data' }, { id: 'k-a', from: 'kafka', to: 'worker-a', kind: 'data' }, { id: 'k-b', from: 'kafka', to: 'worker-b', kind: 'data' },
      { id: 'a-r', from: 'worker-a', to: 'redis', kind: 'data' }, { id: 'a-c', from: 'worker-a', to: 'clickhouse', kind: 'data' }, { id: 'b-r', from: 'worker-b', to: 'redis', kind: 'data' },
      { id: 'b-c', from: 'worker-b', to: 'clickhouse', kind: 'data' }, { id: 'r-out', from: 'redis', to: 'consumers', kind: 'data' }, { id: 'c-out', from: 'clickhouse', to: 'consumers', kind: 'data' },
      { id: 'a-obs', from: 'worker-a', to: 'stream-signals', kind: 'observability' }, { id: 'b-obs', from: 'worker-b', to: 'stream-signals', kind: 'observability' },
    ],
    normalRoute: ['producers', 'kafka', 'worker-a', 'redis', 'consumers'], fallbackRoute: ['producers', 'kafka', 'worker-b', 'clickhouse', 'consumers'], workerIds: ['worker-a', 'worker-b'],
  },
  {
    id: 'secure-ai', label: 'Secure Enterprise AI', eyebrow: '03 / CONTROL + DATA PLANES', boundaryLabel: 'Sovereign compute boundary', runLabel: 'Test controlled request',
    summary: 'Identity and policy guard a private inference path while provisioning and observability remain separate control-plane concerns.', disclaimer,
    nodes: [
      { id: 'enterprise-user', label: 'Enterprise user', kind: 'application', summary: 'Initiates an authenticated business request.', technologies: ['TypeScript'], x: 10, y: 48 },
      { id: 'identity', label: 'Identity', kind: 'identity', summary: 'Establishes a verifiable identity before access is evaluated.', technologies: ['OpenID Connect'], x: 25, y: 28 },
      { id: 'policy', label: 'Policy gateway', kind: 'identity', summary: 'Applies explicit access and data-handling policy.', technologies: ['Vault'], x: 43, y: 48 },
      { id: 'private-inference', label: 'Private inference', kind: 'inference', summary: 'Runs model serving inside the controlled boundary.', technologies: ['vLLM', 'TensorRT-LLM', 'Bare-Metal'], x: 66, y: 48, worker: true },
      { id: 'private-data', label: 'Private data', kind: 'data', summary: 'Keeps sensitive context inside the platform boundary.', technologies: ['PostgreSQL', 'Qdrant'], x: 66, y: 76 },
      { id: 'response', label: 'Controlled response', kind: 'application', summary: 'Returns output through the same governed boundary.', technologies: ['Go'], x: 90, y: 48 },
      { id: 'provisioning', label: 'Provisioning', kind: 'provisioning', summary: 'Defines infrastructure separately from the live request path.', technologies: ['Terraform', 'Ansible', 'AWS'], x: 43, y: 86 },
      { id: 'audit', label: 'Audit signals', kind: 'observability', summary: 'Collects operational evidence for review and audit preparation.', technologies: ['Prometheus', 'Grafana', 'ELK Stack', 'SOC 2', 'ISO 27001', 'GDPR'], x: 66, y: 18 },
    ],
    edges: [
      { id: 'u-i', from: 'enterprise-user', to: 'identity', kind: 'data' }, { id: 'i-p', from: 'identity', to: 'policy', kind: 'data' }, { id: 'p-inf', from: 'policy', to: 'private-inference', kind: 'data' },
      { id: 'data-inf', from: 'private-data', to: 'private-inference', kind: 'data' }, { id: 'inf-r', from: 'private-inference', to: 'response', kind: 'data' },
      { id: 'prov-inf', from: 'provisioning', to: 'private-inference', kind: 'control' }, { id: 'inf-audit', from: 'private-inference', to: 'audit', kind: 'observability' }, { id: 'policy-audit', from: 'policy', to: 'audit', kind: 'observability' },
    ],
    normalRoute: ['enterprise-user', 'identity', 'policy', 'private-inference', 'response'], fallbackRoute: [], workerIds: ['private-inference'],
  },
];
