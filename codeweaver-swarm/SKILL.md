`---
name: codeweaver-swarm
description: Autonomous multi-agent software engineering swarm that transforms natural language ideas into complete, deployed applications. Use when the user wants to (1) build a new software project from an idea or requirement, (2) add features to an existing codebase, (3) fix bugs or refactor code autonomously, (4) set up an AI-powered coding assistant with multiple specialized agents, (5) create a system where AI agents collaborate to write, test, and deploy code. Covers web apps, desktop apps, mobile apps (Android), APIs, and CLI tools. Triggers on phrases like "build me an app", "create a project", "autonomous coding agent", "AI coding team", "multi-agent coding", "code generation swarm", or any request to build software with minimal manual intervention.
---

# CodeWeaver Swarm

Autonomous multi-agent software engineering system. User provides an idea; the swarm researches, designs, debates, builds, tests, secures, documents, deploys, and continuously improves the software.

## Architecture

```
Orchestrator (Boss/Cloud)
  ├─ Product Manager  ┐
  ├─ Researcher       │
  ├─ Architect        │  Local agents on user hardware
  ├─ Coder (×N)       │  (16GB RAM / 6GB VRAM min)
  ├─ Tester           │
  ├─ Security Auditor │
  ├─ DevOps           │
  ├─ Documentation    │
  ├─ Performance      │
  └─ UX Researcher    ┘
```

**Orchestrator:** Cloud LLM (GPT-4, Claude) — plans, reviews, approves.
**Workers:** Local LLMs (Ollama, LM Studio) — execute tasks.

## Workflow

### Phase 1: Intake & Planning

1. **Idea capture** — Orchestrator receives user request
2. **Clarification** — Product Manager asks 1-3 targeted questions
3. **Research** — Researcher analyzes market, finds best practices
4. **Architecture debate** — 3-phase debate (diverge → converge → synthesize)
5. **Task decomposition** — Architect breaks work into dependency graph

See [references/debate-framework.md](references/debate-framework.md) for debate mechanics.

### Phase 2: Execution

1. **Task scheduling** — Orchestrator assigns tasks to agents based on capabilities
2. **Parallel execution** — Independent tasks run simultaneously
3. **Sequential chains** — Dependent tasks wait for prerequisites
4. **Self-healing** — Failures trigger retry with alternative strategies
5. **Quality gates** — Each task passes through: Coder → Tester → Security

### Phase 3: Delivery & Maintenance

1. **Documentation** — Auto-generated README, API docs, ADRs
2. **Deployment** — DevOps configures CI/CD and deploys
3. **Monitoring** — Performance tracking, error detection
4. **Continuous refinement** — Auto-generated improvement tasks from monitoring

## Agent System Prompts

Each agent has a specialized system prompt defining role, capabilities, and output format.

See [references/agent-system-prompts.md](references/agent-system-prompts.md) for complete prompts for all 10 agent roles.

Key agents:
- **Orchestrator** — Coordinates swarm, approves deployments
- **Product Manager** — Clarifies requirements, writes PRDs
- **Architect** — Designs systems, writes ADRs
- **Coder** — Implements features, follows code standards
- **Tester** — Writes tests, ensures >80% coverage
- **Security Auditor** — Scans vulnerabilities, blocks insecure code
- **DevOps** — Deploys, configures monitoring
- **Researcher** — Finds best practices, compares libraries
- **Documentation** — Maintains docs in sync with code
- **Performance** — Optimizes speed and resource usage

## Memory System

Hybrid dual-layer memory:
- **Vector RAG** (ChromaDB/Pinecone) — Find semantically similar code
- **Knowledge Graph** (NetworkX/Neo4j) — Understand code relationships

See [references/memory-system.md](references/memory-system.md) for implementation details.

Key capabilities:
- Impact analysis: "What breaks if I change X?"
- Reflection synthesis: Learn from successes and failures
- Cross-project memory: Improve over time across projects

## Model Router

Intelligent provider selection based on task complexity, available resources, and cost constraints.

See [references/model-router-spec.md](references/model-router-spec.md) for full specification.

Routing logic:
1. Classify task complexity (simple/medium/complex/critical)
2. Filter providers by capability and available VRAM
3. Rank by quality-per-dollar
4. Apply circuit breaker for failing providers
5. Track costs against budget

Hardware profiles:
- **Minimal** (16GB/6GB): Local 7B models + cloud for complex tasks
- **Standard** (32GB/12GB): Local 13B models + cloud for critical
- **Powerful** (64GB/24GB): Local 70B models, minimal cloud usage

## Tools

Agents have access to file system, terminal, git, web search, LLM queries, code generation, and deployment tools.

See [references/tools-registry.md](references/tools-registry.md) for complete tool catalog.

Key tools:
- `read_file`, `write_file`, `patch_file`, `list_files`, `delete_file`
- `run_command` (with timeout and sandbox)
- `git_init`, `git_status`, `git_add`, `git_commit`, `git_diff`
- `web_search`, `fetch_url`
- `query_llm`, `generate_code`, `review_code`
- `docker_build`, `deploy_to_cloud`

## Dashboard

Interactive glassmorphism web dashboard showing:
- Real-time agent swarm status
- Task pipeline Kanban board
- Decision audit trail
- Live log streaming
- Resource monitoring (RAM, VRAM, API costs)
- Intervention controls (approve, reject, pause, override)

## Configuration

```yaml
codeweaver:
  # LLM Providers
  providers:
    ollama:
      enabled: true
      endpoint: http://localhost:11434
      models: [llama3.1:8b, mistral:7b]
    openai:
      enabled: true
      api_key: ${OPENAI_API_KEY}
      models: [gpt-4o-mini, gpt-4o]

  # Budget
  budget:
    daily_limit_usd: 5.00
    alert_threshold: 80

  # Hardware
  hardware_profile: standard  # minimal, standard, powerful, cloud-first

  # Agents
  agents:
    max_concurrent: 5
    autonomy_level: advisory  # silent, advisory, approval_required

  # Memory
  memory:
    vector_db: chromadb  # chromadb, pinecone
    knowledge_graph: networkx  # networkx, neo4j
```

## Quick Start

1. Install dependencies: `ollama`, `docker`, `node`, `python`
2. Run: `codeweaver init "Your app idea here"`
3. Answer 1-3 clarification questions
4. Watch the swarm work via dashboard
5. Receive deployed application URL

## Safety

- All code execution sandboxed in Docker
- Secret detection blocks commits with credentials
- Security auditor gates all deployments
- Circuit breakers prevent API cost overruns
- Human approval required for: architecture changes, security decisions, production deployments
