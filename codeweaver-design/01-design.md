# CoNinja Swarm — System Design PRD

## 1. Product Overview

### 1.1 Product Name
**CoNinja** — Autonomous Software Engineering Swarm

### 1.2 Product Description

CoNinja is a fully autonomous multi-agent coding system that transforms a simple natural language idea into a complete, deployed, and maintained software application. It functions as an entire software engineering organization in a box — complete with an Grandmasterure Head (cloud orchestrator), specialized local AI agents (Coder, Kunai Tester, Security, Chunin DevOps, etc.), and an intelligent memory system. The user acts as the CEO providing the vision, while CoNinja handles everything from research and planning to coding, testing, deployment, and continuous improvement.

**The Philosophy:** *"You bring the idea. We bring the team."*

### 1.3 Target Users

- **Solo entrepreneurs** with app ideas but no coding team
- **Non-technical founders** who want to build MVPs
- **Technical leads** who want to accelerate development 10x
- **Small teams** who need additional engineering capacity
- **Hackathon participants** who want to ship faster

### 1.4 Value Proposition

Describe your software product in plain English. CoNinja researches the market, designs the architecture, debates the approach, writes the code, tests it rigorously, secures it, documents it, deploys it to the cloud, and continuously monitors and improves it — all autonomously. You are the CEO, not the "vibe coder."

### 1.5 User Experience Goals

- **Zero-to-deployed in hours, not weeks** — From idea to live application
- **Transparent decision-making** — See why every architectural choice was made
- **Minimal intervention** — The system runs autonomously with smart escalation
- **Full auditability** — Every decision, every debate, every line of code is traceable
- **Resource-aware** — Runs on modest hardware (16GB RAM, 6GB VRAM), scales with better specs
- **Cost-controlled** — Smart model selection keeps cloud API costs minimal

---

## 2. Functional Design

### 2.1 Core Features

#### 2.1.1 Multi-Agent Swarm Orchestration

**Description:** A dynamic graph-based multi-agent system where specialized AI agents collaborate on software engineering tasks. Agents form sub-teams dynamically based on task requirements, debate approaches, and execute in parallel when possible.

**User Story:** As a user, I describe "Build me a task management app with team collaboration," and the system automatically assigns the Recon Shinobi to clarify requirements, the Grandmaster to design the system, the Researcher to find the best tech stack, Coders to implement features, Kunai Testers to ensure quality, and Chunin DevOps to deploy — all working autonomously.

**Acceptance Criteria:**
- Minimum 8 specialized agent roles (Grandmaster, Coder, Kunai Tester, Security, Chunin DevOps, Researcher, Scroll Keeper, Taijutsu)
- Dynamic sub-team formation based on task requirements
- Parallel execution of independent tasks
- Automatic escalation path when agents are blocked
- Real-time status visible on dashboard

**Priority:** P0 (Core functionality)

#### 2.1.2 Three-Phase Intelligent Planning

**Description:** Every major decision goes through a structured three-phase process: Divergence (generate alternatives), Convergence (evaluate and score), and Synthesis (combine best elements). This applies to architecture decisions, tech stack selection, task decomposition, and implementation approaches.

**User Story:** When deciding between PostgreSQL and MongoDB, three agents propose different arguments, a scoring system weighs factors (data structure, scaling needs, team familiarity), and the winning approach is synthesized with confidence scoring.

**Acceptance Criteria:**
- Automatic debate triggering for architecture-level decisions
- Weighted scoring matrix across: Cost, Speed, Quality, Maintainability, Risk
- Minimum 3 alternatives generated per decision
- Human-readable rationale stored for every decision
- Confidence score attached to every outcome

**Priority:** P0

#### 2.1.3 Hybrid RAG + Knowledge Graph Memory

**Description:** A dual-layer memory system combining vector-based retrieval (for similar code/text) with a semantic knowledge graph (for code relationships, dependencies, and architecture understanding). This enables both "find similar code" and "understand the impact of changes."

**User Story:** When I ask to "change the user authentication flow," the system not only finds auth-related code but also identifies all API endpoints, frontend components, and tests that depend on auth — preventing breaking changes.

**Acceptance Criteria:**
- Local TF-IDF vector search for fast retrieval
- Optional Pinecone integration for cloud-scale projects
- Knowledge graph with nodes: File, Function, Class, API Endpoint, DB Table
- Graph edges: IMPORTS, CALLS, DEPENDS_ON, EXPOSES, TESTS
- Query: "What breaks if I change X?" returns all dependents

**Priority:** P0

#### 2.1.4 Self-Healing Task Pipeline

**Description:** An execution pipeline that automatically detects failures, classifies them, applies retry strategies, and escalates if needed. The system learns from failures to prevent recurrence.

**User Story:** When a test fails after a code change, the system automatically debugs the failure, identifies the root cause, generates a fix, applies it, and re-runs the tests — all without human intervention.

**Acceptance Criteria:**
- Automatic failure classification (syntax, logic, dependency, architecture)
- Retry strategies per failure type (auto-fix, alternative approach, escalate)
- Maximum retry limits before escalation
- Failure pattern learning ("This type of error usually means X")
- Checkpoint recovery: Resume from last successful state

**Priority:** P0

#### 2.1.5 Multi-Provider LLM Router

**Description:** An intelligent model router that selects the optimal LLM for each task based on complexity, available resources, cost constraints, and model capabilities. Supports both local (Ollama, LM Studio, llama.cpp) and cloud (OpenAI, Anthropic, Gemini, OpenRouter) providers.

**User Story:** The system uses my local 7B model for simple text formatting, a local 13B for component creation, and only calls GPT-4 for complex architectural decisions — keeping costs low while maintaining quality.

**Acceptance Criteria:**
- Support for 8+ providers: Ollama, OpenAI, Anthropic, Gemini, OpenRouter, LM Studio, llama.cpp, vLLM
- Task complexity assessment (Simple/Medium/Critical)
- Resource-aware routing (checks available RAM/VRAM)
- Circuit breaker pattern for failing providers
- Cost tracking and budget enforcement
- Automatic fallback chain

**Priority:** P0

#### 2.1.6 Interactive Glassmorphism Dashboard

**Description:** A real-time web dashboard with glassmorphism design showing all agent activity, task pipelines, decision audit trails, resource usage, and providing intervention points for the user.

**User Story:** I open the dashboard and see a live view of 5 agents working on my project — one architect debating database choices, two coders implementing features, a tester writing test cases, and a Chunin DevOps agent preparing deployment configs. I can click any agent to see what it's doing.

**Acceptance Criteria:**
- Real-time agent status visualization (Thinking, Coding, Testing, Waiting, Error)
- Task pipeline Kanban board with dependency visualization
- Live log streaming with filtering and search
- Decision audit trail with rationale
- Resource monitoring (RAM, VRAM, API costs)
- Intervention buttons (Approve, Reject, Pause, Override)

**Priority:** P1 (Important but not blocking)

#### 2.1.7 Continuous Refinement Loop

**Description:** After deployment, the system continuously monitors the application, identifies improvement opportunities, and autonomously generates and executes improvement tasks.

**User Story:** My deployed app has a slow login endpoint. The system detects this through performance monitoring, creates a task to optimize the database query, implements caching, tests the improvement, and deploys the update — all while I sleep.

**Acceptance Criteria:**
- Post-deployment monitoring (error rates, performance, user patterns)
- Automatic technical debt detection
- Taijutsu regression identification
- Auto-generated improvement tasks with priority scoring
- User feedback integration ("This feature is slow" -> task created)

**Priority:** P1

#### 2.1.8 Security-First Development

**Description:** Continuous security auditing throughout the development lifecycle — from code writing to deployment. Includes secret detection, vulnerability scanning, dependency checking, and secure deployment practices.

**User Story:** I accidentally include an API key in my code. Before any commit, the Stealth Auditor detects it, removes it, moves it to environment variables, updates .gitignore, and regenerates the key — preventing a security incident.

**Acceptance Criteria:**
- Pre-commit secret detection (API keys, passwords, tokens)
- OWASP Top 10 vulnerability scanning
- Dependency CVE checking via OSV database
- Automatic .env and .gitignore management
- Secure deployment configurations by default
- Security findings block deployment (configurable)

**Priority:** P1

#### 2.1.9 File System & Terminal Tools

**Description:** Comprehensive file system operations and terminal execution capabilities with safety controls and sandboxing.

**User Story:** The system needs to create a new React component. It reads the existing component structure, creates the new file with proper imports, writes the code, runs the build to verify, and commits to git.

**Acceptance Criteria:**
- File: read, write, patch (AST-aware), list, delete, search
- Terminal: execute with timeout, capture output, handle errors
- Git: init, status, add, commit, diff, branch, merge
- Web: search, fetch URL content, parse HTML
- Environment: check port availability, HTTP ping
- Safety: Confirm destructive operations, sandbox execution

**Priority:** P0

#### 2.1.10 The "Always-On" 24/7 Autonomous Engine

**Description:**
To function like Devin or Claude Code, CoNinja operates continuously in the background, proactively finding and fixing issues without waiting for user prompts.

*   **Proactive Issue Hunter Agent:** A dedicated agent role that continuously monitors the project. It integrates directly with error tracking tools (Sentry, Datadog), GitHub/GitLab issue trackers, and production logs. When an error spikes, this agent automatically creates a task, diagnoses the stack trace, and dispatches it to the Swarm.
*   **Dependency & Tech-Debt Auto-Updater:** A scheduled cron-agent that runs weekly. It checks for outdated dependencies, automatically bumps versions, runs the test suite, and generates a PR. If tests fail, it auto-reverts or attempts to fix the breaking changes.
*   **Background Refactoring Sweeps:** When the swarm is idle, the Sensei assigns "low-priority" tasks, such as finding dead code using the Knowledge Graph, migrating deprecated APIs, or adding missing documentation.

**User Story:** While the development team is offline, a critical Sentry error spikes in production. The Proactive Issue Hunter catches the stack trace, creates a bug fix task, and dispatches it. By morning, a tested and verified pull request is waiting in GitHub with a complete explanation of the fix.

**Acceptance Criteria:**
- Real-time integrations with Sentry and GitHub Issues webhook triggers.
- Weekly cron scheduler for dependency updates with automatic rollback capability.
- Automated code health sweeps using the repository knowledge graph to locate dead code.

**Priority:** P1

#### 2.1.11 Deep Understanding: Hyper-Optimized RAG for Small Models

**Description:**
Small models struggle with "lost in the middle" phenomena and cannot process entire repositories. The existing Hybrid Memory System (Vector + Knowledge Graph) is extended into a highly precise Code Slicing Engine.

*   **Code Property Graphs (CPG):** Enhances the existing NetworkX graph to include Abstract Syntax Trees (AST), Control Flow Graphs (CFG), and Data Flow Graphs (DFG). This allows the agent to ask: "Trace exactly where this specific variable is modified across these three files."
*   **Semantic Context Slicing:** Instead of feeding a full 500-line file to a 7B model, the RAG system uses the CPG to extract only the function signature being edited, its direct dependencies, and the specific type definitions it needs. The context window is kept artificially small (under 2k tokens) to ensure the smaller model maintains high reasoning fidelity.
*   **Hierarchical Repository Summarization:** Small models need a "map" of the codebase. The system maintains a continuously updated tree of summaries:
    *   **Level 1:** Whole repo summary (1 paragraph).
    *   **Level 2:** Module/Folder summaries.
    *   **Level 3:** File summaries (Interface definitions).
    The agent navigates this tree top-down, only pulling full file contents when absolutely necessary.

**User Story:** When implementing a feature change with an 8B model, the model receives only a 1.5k token context containing the precise target function, the type declarations of its arguments, and its calling signatures—avoiding model confusion and maintaining high correctness.

**Acceptance Criteria:**
- NetworkX graph extended with AST nodes and data-flow edges.
- Context window optimizer that slices file inputs to <2k tokens.
- Level 1/2/3 hierarchical codebase summary map cached and updated on git hooks.

**Priority:** P0

#### 2.1.12 Self-Corrective & Self-Healing Workflows

**Description:**
While the design includes a "Self-Healing Task Pipeline", small models require a much tighter, micro-step feedback loop to prevent them from hallucinating or going down "rabbit holes."

*   **Stateful REPL / Sandbox Environments:** Gives the agents access to a persistent, stateful bash shell and interactive code runner (like Jupyter kernels). Instead of writing a whole file and running it, the Coder agent evaluates small snippets in the REPL, checks the output, and adjusts its mental model in real-time.
*   **"Rabbit-Hole" Detection & Auto-Revert:** Small models can get stuck in loops (e.g., repeatedly fixing one error that causes another). If an agent modifies the same AST node more than 3 times without tests passing, the Sensei forces a `git reset --hard` to the last known good state and changes the strategy or escalates to a more powerful cloud model.
*   **Micro-TDD (Test-Driven Development) Loop:** Forces smaller models into a strict behavior pattern. They are not allowed to write feature code until they have successfully written a failing test, executed it, and observed the failure. This anchors the model's objective in a concrete, verifiable output.

**User Story:** An agent tries to fix a syntax error but gets caught in a loop. After 3 failed attempts, the orchestrator detects the recursion, reverts the workspace to the last green commit, and upgrades the task to a cloud LLM to prevent code corruption.

**Acceptance Criteria:**
- Persistent Jupyter/REPL sessions for sandbox testing of code snippets.
- Execution history monitor tracking AST modification counts.
- Strict Micro-TDD loop gating: test file must fail before implementation code edit.

**Priority:** P0

#### 2.1.13 Extracting Exceptional Results from Small Models

**Description:**
To make an 8B parameter model perform like a 70B model, the system constrains its outputs and structures its reasoning.

*   **Grammar-Constrained Decoding:** When a small model uses tools (like `write_file` or `run_command`), it often corrupts JSON formatting. Integrates tools like Outlines or llama.cpp's grammar constraints to physically prevent the local models from outputting invalid JSON tool call parameters.
*   **Multi-Agent Peer Verification:** Uses a "Doer-Checker" pattern. Model A (Coder) writes the code. Model B (Security/Kunai Tester) is given the diff and explicitly prompted to only find flaws. Small models are often much better at critiquing code than generating it perfectly on the first try.
*   **Prompt Chaining over Zero-Shot:** Instead of giving the Grandmaster agent one massive prompt to design the whole system, the task is broken down programmatically:
    *   **Step 1:** "Identify the database tables needed." (Stop)
    *   **Step 2:** "Write the relationships for these tables." (Stop)
    *   **Step 3:** "Write the API endpoints." (Stop)
    This dramatically reduces the cognitive load on smaller local models.

**User Story:** An 8B Coder model outputs a tool call. The grammar constraint engine intercepts it at the token level, ensuring the output strictly matches the tool JSON schema. Model B then checks the code for logic errors, giving feedback before deployment.

**Acceptance Criteria:**
- Json Schema validation grammar applied to local model inference endpoints.
- Doer-Checker pipeline configuration for all implementation-level tasks.
- Programmatic task sequencer for multi-step prompts.

**Priority:** P0

### 2.2 Feature Priority Table

| Feature | Priority | Status | Complexity |
|---|---|---|---|
| Always-On Autonomous Engine | P1 | Important | High |
| Hyper-Optimized RAG for Small Models | P0 | Must Have | High |
| Self-Corrective Workflows | P0 | Must Have | Medium |
| Small Model Optimization / Constraints | P0 | Must Have | Medium |
| Multi-Agent Swarm Orchestration | P0 | Must Have | High |
| Three-Phase Intelligent Planning | P0 | Must Have | High |
| Hybrid RAG + Knowledge Graph | P0 | Must Have | High |
| Self-Healing Task Pipeline | P0 | Must Have | High |
| Multi-Provider LLM Router | P0 | Must Have | Medium |
| File System & Terminal Tools | P0 | Must Have | Medium |
| Interactive Glassmorphism Dashboard | P1 | Important | Medium |
| Continuous Refinement Loop | P1 | Important | High |
| Security-First Development | P1 | Important | Medium |
| A/B Testing Framework | P1 | Important | Medium |
| Competitive Intelligence | P2 | Nice to Have | Medium |
| Multi-Modal Input | P2 | Nice to Have | High |
| Mobile App Generation | P2 | Nice to Have | High |
| Plugin System | P2 | Nice to Have | Medium |

### 2.3 User Flows

#### Flow 1: New Project Creation

```
User: "Build me a task management app with team collaboration and real-time updates"

Step 1: Idea Intake (Recon Shinobi Agent)
├── Ask clarifying questions (max 2-3 rounds)
│   "Who are the target users?"
│   "What platforms? (web/mobile/desktop)"
│   "Any specific features you need?"
├── Generate User Personas
├── Create User Stories
└── Output: Product Requirements Document

Step 2: Research (Researcher Agent)
├── Search for similar open-source projects
├── Analyze their tech stacks and features
├── Identify best practices for real-time collaboration
├── Check popular libraries for task management
└── Output: Research Report with recommendations

Step 3: Grandmasterure Planning (Grandmaster Agent)
├── Propose 3 architecture alternatives
├── Debate: Monolith vs Microservices vs Modular Monolith
├── Select tech stack based on requirements
├── Design database schema
├── Design API endpoints
└── Output: Grandmasterure Decision Records + Technical Specification

Step 4: Task Decomposition (Planner Agent)
├── Break architecture into epics
├── Break epics into user stories
├── Break stories into implementable tasks
├── Establish dependencies between tasks
├── Debate task ordering and granularity
└── Output: Task Dependency Graph

Step 5: Implementation (Coder Agents)
├── Parallel execution where possible
├── Frontend team: UI components, pages, state management
├── Backend team: API routes, database models, auth
├── Integration: Connect frontend and backend
└── Output: Working code in workspace

Step 6: Testing (Kunai Tester Agent)
├── Write unit tests for all functions
├── Write integration tests for API endpoints
├── Write E2E tests for critical user flows
├── Run full test suite
├── Fix any failures
└── Output: Test suite with >80% coverage

Step 7: Security Review (Security Agent)
├── Scan for secrets and vulnerabilities
├── Review authentication and authorization
├── Check input validation
├── Verify dependency security
├── Fix or flag all findings
└── Output: Security report

Step 8: Scroll Keeper (Scroll Keeper Agent)
├── Write README with setup instructions
├── Document API endpoints
├── Write architecture overview
├── Create deployment guide
└── Output: Complete documentation

Step 9: Deployment (Chunin DevOps Agent)
├── Generate Dockerfile and docker-compose
├── Create CI/CD pipeline configuration
├── Deploy to user's chosen platform
├── Configure monitoring and alerts
└── Output: Live application URL

Step 10: Handoff
├── Present deployed application
├── Summary of what was built
├── Grandmasterure overview
├── How to make changes
└── Monitoring dashboard link
```

#### Flow 2: Feature Addition to Existing Project

```
User: "Add a notification system with email and push notifications"

Step 1: Impact Analysis (Grandmaster Agent)
├── Query knowledge graph: "What depends on the current system?"
├── Identify touchpoints: User model, Task model, API routes
├── Assess if current architecture supports the feature
└── Output: Impact Assessment Report

Step 2: Design (Grandmaster + Researcher)
├── Research notification libraries and services
├── Design notification architecture
├── Define notification triggers and templates
├── Debate: Build vs Buy (SendGrid vs AWS SES vs self-hosted)
└── Output: Notification System Design Doc

Step 3: Task Generation (Planner Agent)
├── Add notification service module
├── Add notification preferences to user settings
├── Add notification triggers to task lifecycle
├── Add email template system
├── Add push notification support
├── Write tests for notification system
└── Output: Task list with dependencies

Step 4-8: Same as Flow 1 (Implementation, Testing, Security, Scroll Keeper, Deploy)
```

#### Flow 3: Bug Fix / Emergency Response

```
User: "The login page is broken, users can't sign in"
OR System detects: Error rate on /api/auth/login > 5%

Step 1: Diagnosis (Kunai Tester + Coder Agents)
├── Attempt to reproduce the issue
├── Check recent commits that touched auth code
├── Review error logs
├── Identify root cause
└── Output: Bug Report with root cause analysis

Step 2: Fix Strategy Debate
├── Propose 2-3 fix approaches
├── Score on: Speed, Safety, Correctness
├── Select best approach
└── Output: Fix plan with confidence score

Step 3: Implementation
├── Write fix with regression test
├── Run test suite
├── Verify fix resolves the issue
└── Output: Fixed code + test

Step 4: Deploy
├── Create hotfix branch
├── Deploy to staging
├── Verify on staging
├── Deploy to production
├── Monitor error rates
└── Output: Deployed fix + monitoring confirmation
```

### 2.4 Use Case Scenarios

#### Scenario 1: The Non-Technical Founder

**User:** Sarah, founder of a startup idea. Knows business, doesn't code.
**Goal:** Build an MVP marketplace for local artisans.
**Interaction:**
1. Sarah describes her idea to CoNinja in natural language
2. Recon Shinobi asks 2 clarifying questions about target users and must-have features
3. Sarah answers via the dashboard chat interface
4. CoNinja goes silent for 30 minutes while the swarm works
5. Sarah opens the dashboard to see agents debating tech stack choices
6. After 2 hours, she receives a notification: "Your marketplace MVP is live at https://..."
7. She tests it, provides feedback via the dashboard
8. CoNinja iterates based on her feedback autonomously

#### Scenario 2: The Technical Lead

**User:** Marcus, senior engineer at a growing startup. Has a team but needs to move faster.
**Goal:** Accelerate feature development by delegating to CoNinja.
**Interaction:**
1. Marcus connects CoNinja to his existing GitHub repo
2. Specifies coding standards and architecture constraints
3. Assigns CoNinja a feature: "Implement real-time notifications using our existing WebSocket infrastructure"
4. CoNinja analyzes the codebase, understands the patterns
5. Implements the feature following existing conventions
6. Marcus reviews the pull request with full audit trail of decisions
7. Approves with minor tweaks, CoNinja applies them
8. Feature deployed in hours instead of days

#### Scenario 3: The Hackathon Participant

**User:** Alex, participating in a 24-hour hackathon.
**Goal:** Ship a working prototype with impressive features.
**Interaction:**
1. Alex describes the hackathon challenge
2. CoNinja rapidly scopes the MVP (15 minutes)
3. Swarm works in parallel: frontend, backend, and Chunin DevOps simultaneously
4. Dashboard shows real-time progress
5. 3 hours later, prototype is deployed and working
6. Remaining 21 hours: Alex uses CoNinja to add polish and advanced features
7. Presents working demo with confidence

---

## 3. Non-Functional Design

### 3.1 Taijutsu Requirements

| Metric | Target | Notes |
|---|---|---|
| Initial planning phase | < 15 minutes | From idea to approved task list |
| Code generation speed | ~1000 lines/hour | Depends on model and complexity |
| Test execution | < 5 minutes | Full test suite for average project |
| Dashboard load time | < 2 seconds | Initial load with all visualizations |
| Log stream latency | < 1 second | Real-time log updates |
| Agent response time | < 10 seconds | For simple tasks with local models |
| Memory search | < 500ms | RAG query for context retrieval |
| Concurrent agents | 5-10 | Based on 16GB RAM constraint |

### 3.2 Scalability Design

**Horizontal Scaling:**
- Agent count: Start with 3-5, scale to 10+ with better hardware
- Memory: SQLite/ChromaDB for small projects, PostgreSQL/Pinecone for large
- LLM: Local models for 80% of tasks, cloud APIs for critical 20%

**Resource-Aware Scaling:**
```
16GB RAM + 6GB VRAM:  3-5 local agents, cloud for complex tasks
32GB RAM + 12GB VRAM: 5-8 local agents, 13B models locally
64GB RAM + 24GB VRAM: 10+ agents, 70B models locally, minimal cloud
```

### 3.3 Security Grandmasterure

**Layered Security Model:**
```
Layer 1: Sandboxing
├── Docker containers for code execution
├── Network restrictions (whitelist only)
├── Resource limits (CPU, memory, disk quotas)
└── No access to host system files (except workspace)

Layer 2: Permission System
├── Read-Only: Can read code, cannot modify
├── Code-Only: Can modify code, cannot execute
├── Trusted: Can execute tests, cannot install deps
├── Privileged: Can install deps, cannot deploy
└── Full: Can deploy (requires explicit approval)

Layer 3: Secret Protection
├── Pre-commit secret scanning
├── .env file auto-management
├── Hardcoded credential detection
├── Git history scanning for past leaks
└── Block commits with detected secrets

Layer 4: Dependency Security
├── CVE checking on install
├── Abandoned package detection
├── Version pinning for reproducibility
└── Weekly security update checks
```

### 3.4 Reliability Design

**Self-Healing Mechanisms:**
- Circuit breaker for LLM providers (failover to backup)
- Checkpoint system: Save state every 5 minutes
- Automatic retry with exponential backoff
- Graceful degradation: Reduce agent count if resources constrained
- Atomic operations: Code changes are all-or-nothing (rollback on failure)

**Data Integrity:**
- Git as source of truth for all code changes
- Immutable decision audit log
- RAG memory versioning
- Knowledge graph snapshots

### 3.5 Compatibility Requirements

| Component | Minimum | Recommended |
|---|---|---|
| OS | Ubuntu 22.04, macOS 13, Windows 11 | Ubuntu 24.04, macOS 14 |
| RAM | 16 GB | 32 GB |
| VRAM | 6 GB | 12 GB |
| Disk | 50 GB free SSD | 100 GB free NVMe |
| Internet | 10 Mbps | 50 Mbps |
| Browser | Chrome 120+, Firefox 121+ | Chrome 125+ |

### 3.6 Maintainability Design

- **Modular Grandmasterure:** Each agent is a plugin that can be updated independently
- **Configuration-Driven:** Agent behavior controlled via config files, not code changes
- **Comprehensive Logging:** Structured logs for all agent actions, decisions, and failures
- **Health Monitoring:** Built-in health checks for all components
- **Hot Reload:** Configuration changes without restart
- **Versioned Memory:** Knowledge base can be rolled back to previous states

---

## 4. Interaction Design

### 4.1 Interaction Patterns

#### 4.1.1 Command Interface (CLI)

```bash
# Initialize a new project
coninja init "Task management app with team collaboration"

# Check status
coninja status
# Output:
# 🚀 Project: TaskMaster
# 👷 8 agents active
# ✅ 12 tasks completed
# 🔄 3 tasks in progress
# ⏳ 5 tasks pending
# ❌ 0 tasks failed

# View logs
coninja logs --agent architect --follow

# Approve a pending decision
coninja approve --decision 42

# Pause all agents
coninja pause

# Resume
coninja resume

# Deploy
coninja deploy --target vercel
```

#### 4.1.2 Dashboard Interface (Web UI)

**Main Dashboard Layout:**
```
+------------------------------------------------------------------+
|  CoNinja 🚀          |  Project: TaskMaster    |  ⚡ Resources  |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+  +------------------------------------+     |
|  | AGENT SWARM      |  | TASK PIPELINE                       |     |
|  |                  |  |                                     |     |
|  | 🧙 Grandmaster    |  | [Todo] [In Progress] [Review] [Done]|     |
|  |    🔄 Planning   |  |                                     |     |
|  |                  |  | □ Auth module   ■ API routes      |     |
|  | 👨‍💻 Coder 1    |  | ■ Database      ■ Frontend UI   |     |
|  |    ✅ Active      |  | ■ Tests          □ Scroll Keeper   |     |
|  |                  |  | □ Deploy         ■ Bug fixes       |     |
|  | 👨‍💻 Coder 2    |  |                                     |     |
|  |    ✅ Active      |  +------------------------------------+     |
|  |                  |                                          |
|  | 🧠 Kunai Tester       |  +------------------------------------+     |
|  |    ⏳ Waiting     |  | LIVE CONSOLE                        |     |
|  |                  |  | [14:32:01] Grandmaster: Debating DB...|     |
|  | 🔐 Security      |  | [14:32:15] Coder 1: Writing auth... |     |
|  |    ✅ Active      |  | [14:32:22] Coder 2: Created user... |     |
|  |                  |  | [14:32:30] Security: Scanning...     |     |
|  | 🚀 Chunin DevOps        |  | [14:32:45] System: 2 tasks complete |     |
|  |    ⏳ Pending      |  |                                      |     |
|  |                  |  +------------------------------------+     |
|  +------------------+                                          |
|                                                                    |
|  +------------------+  +------------------------------------+     |
|  | DECISIONS         |  | RESOURCE USAGE                     |     |
|  | ▶ DB: PostgreSQL |  | RAM: 12.4/16 GB ███████▌       |     |
|  |   (confidence 92%)|  | VRAM: 4.2/6 GB  █████▌          |     |
|  | ▶ Auth: JWT      |  | API: $0.23 today █▌               |     |
|  |   (confidence 88%)|  | Agents: 6/8 active                  |     |
|  +------------------+  +------------------------------------+     |
|                                                                    |
+------------------------------------------------------------------+
|  [New Task] [Pause All] [Settings] [Help]                          |
+------------------------------------------------------------------+
```

#### 4.1.3 Chat Interface

```
User: Add a notification system with email alerts when tasks are assigned

🧙 Grandmaster: Analyzing impact on existing codebase...
🧙 Grandmaster: This will touch: User model, Task service, Email service (new)
🧙 Grandmaster: Debating approach: SendGrid vs AWS SES vs Nodemailer

[💬 Debate in progress... View details]

🧙 Grandmaster: Decision: Nodemailer + SMTP (confidence: 87%)
Reason: Simpler setup, no external service dependency, easy to switch later
Alternative considered: SendGrid (better deliverability, but adds cost)

👨‍💻 Coder 1: Creating email service module...
👨‍💻 Coder 1: Created: src/services/email.ts
👨‍💻 Coder 2: Adding notification triggers to task assignment...
👨‍💻 Coder 2: Modified: src/services/task.ts

🧠 Kunai Tester: Writing tests for email service...
🧠 Kunai Tester: 8 tests written, all passing

🔐 Security: Scanning email service for vulnerabilities...
🔐 Security: Found: Email content not escaping HTML (XSS risk)
🔐 Security: Auto-fixed: Added html escaping

🚀 Chunin DevOps: Notification system deployed to staging
🚀 Chunin DevOps: Test it at: https://staging.taskmaster.app

🎉 Feature complete! Review the changes?
[View Diff] [Deploy to Production] [Make Changes]
```

### 4.2 Interaction Logic

#### 4.2.1 User Intervention Points

**Notification Levels:**
| Level | Trigger | User Action Required | Delay |
|---|---|---|---|
| Silent | Low-confidence decision (<70%) | None, logged only | Immediate |
| Notify | Medium-confidence (70-85%) | Optional review | 30 seconds |
| Approve | High-impact decision | Approve/Reject | Blocked until response |
| Emergency | Critical failure or security issue | Immediate action | Blocked until response |

**Intervention Methods:**
- Dashboard: Click any running task to view details or pause
- Chat: Natural language commands ("Stop the deployment", "Use React instead of Vue")
- CLI: Command-line overrides for power users
- Hotkeys: Keyboard shortcuts for common actions (Ctrl+Space pause/resume)

### 4.3 Page Flow

```
Landing Page (/) 
  → Dashboard (/dashboard) — Main control center
      → Agent Detail (/agents/:id) — Individual agent view
      → Task Board (/tasks) — Full task pipeline view
      → Decision Log (/decisions) — Audit trail
      → Code Viewer (/code) — File explorer + editor
      → Logs (/logs) — Full log stream with filters
      → Settings (/settings) — Provider config, agent mapping
          → LLM Providers (/settings/providers)
          → Agent Config (/settings/agents)
          → Security (/settings/security)
          → Budget (/settings/budget)
      → Project Setup (/setup) — New project wizard
```

### 4.4 Responsive Design Strategy

**Desktop (Primary):** Full dashboard with all visualizations
**Tablet:** Collapsible sidebar, simplified agent view
**Mobile:** Read-only status view, chat interface for interventions

---

## 5. Information Grandmasterure

### 5.1 Data Model

#### 5.1.1 Core Entities

**Project:**
```
project {
  id: UUID (PK)
  name: String
  description: Text
  status: Enum [planning, active, paused, completed, archived]
  created_at: Timestamp
  updated_at: Timestamp
  architecture: JSON (ADR documents)
  current_phase: Enum [research, planning, implementation, testing, deployment, maintenance]
  tech_stack: JSON (languages, frameworks, libraries)
  settings: JSON (autonomy level, budget limit, provider preferences)
}
```

**Agent:**
```
agent {
  id: UUID (PK)
  project_id: UUID (FK)
  name: String (e.g., "Grandmaster", "Jutsu Coder", "Kunai Tester")
  role: Enum [architect, coder, tester, security, devops, researcher, documentation, performance, product_manager]
  status: Enum [idle, thinking, working, waiting, error, paused]
  current_task_id: UUID (FK, nullable)
  llm_provider: String (e.g., "ollama:llama3.1:13b")
  system_prompt: Text
  capabilities: JSON (list of skills)
  memory_context: JSON (agent-specific RAG context)
  created_at: Timestamp
}
```

**Task:**
```
task {
  id: UUID (PK)
  project_id: UUID (FK)
  parent_id: UUID (FK, nullable, for subtasks)
  agent_id: UUID (FK, nullable)
  title: String
  description: Text
  status: Enum [pending, in_progress, completed, failed, blocked, cancelled]
  priority: Integer (1-5, 5 = highest)
  complexity: Enum [simple, medium, complex, critical]
  dependencies: JSON (list of task IDs)
  tags: JSON (e.g., ["frontend", "auth", "bugfix"])
  estimated_duration: Integer (minutes)
  actual_duration: Integer (minutes, nullable)
  attempts: Integer (default 0, increment on retry)
  max_attempts: Integer (default 3)
  created_at: Timestamp
  started_at: Timestamp (nullable)
  completed_at: Timestamp (nullable)
  output: Text (nullable, result summary)
  error_log: Text (nullable, failure details)
  confidence_score: Float (0-1, nullable)
}
```

**Decision:**
```
decision {
  id: UUID (PK)
  project_id: UUID (FK)
  task_id: UUID (FK, nullable)
  title: String
  description: Text
  alternatives: JSON (list of {description, pros, cons, score})
  chosen_alternative: Integer (index into alternatives)
  rationale: Text
  confidence: Float (0-1)
  decided_by: String (agent name)
  status: Enum [proposed, debated, decided, implemented, overridden]
  human_override: Boolean (default false)
  created_at: Timestamp
  resolved_at: Timestamp (nullable)
}
```

**Memory Entry (RAG):**
```
memory_entry {
  id: UUID (PK)
  project_id: UUID (FK)
  agent_id: UUID (FK, nullable)
  entry_type: Enum [code_snippet, error_pattern, decision, learning, conversation, document]
  content: Text
  embedding: Vector (1536 dimensions)
  metadata: JSON (file_path, line_numbers, tags, timestamp)
  importance: Float (0-1, calculated)
  created_at: Timestamp
  access_count: Integer (default 0)
}
```

**Knowledge Graph Node:**
```
kg_node {
  id: UUID (PK)
  project_id: UUID (FK)
  node_type: Enum [file, function, class, variable, api_endpoint, database_table, environment_variable]
  name: String
  path: String (file path or identifier)
  properties: JSON (language, signature, visibility, etc.)
  embedding: Vector (1536 dimensions)
  created_at: Timestamp
  updated_at: Timestamp
}
```

**Knowledge Graph Edge:**
```
kg_edge {
  id: UUID (PK)
  project_id: UUID (FK)
  source_node_id: UUID (FK)
  target_node_id: UUID (FK)
  edge_type: Enum [imports, calls, inherits_from, depends_on, exposes, uses, tests, contains]
  properties: JSON (line_number, strength, etc.)
  created_at: Timestamp
}
```

**Conversation:**
```
conversation {
  id: UUID (PK)
  project_id: UUID (FK)
  agent_id: UUID (FK, nullable)
  role: Enum [user, agent, system]
  content: Text
  message_type: Enum [chat, command, notification, decision_request, error]
  metadata: JSON (tokens used, model, latency, cost)
  created_at: Timestamp
}
```

### 5.2 API Design (Internal)

#### Sensei API
```
POST   /api/projects              — Create new project
GET    /api/projects/:id          — Get project status
PUT    /api/projects/:id          — Update project settings
DELETE /api/projects/:id          — Archive project

GET    /api/projects/:id/agents   — List active agents
POST   /api/projects/:id/agents   — Spawn new agent
PUT    /api/agents/:id            — Update agent config
DELETE /api/agents/:id            — Stop agent

GET    /api/projects/:id/tasks    — List tasks
POST   /api/projects/:id/tasks    — Create task
PUT    /api/tasks/:id             — Update task status
POST   /api/tasks/:id/retry       — Retry failed task

GET    /api/projects/:id/decisions — List decisions
POST   /api/decisions/:id/approve  — Approve decision
POST   /api/decisions/:id/reject   — Reject decision

POST   /api/chat                  — Send message to swarm
GET    /api/chat/history          — Get conversation history

GET    /api/projects/:id/logs     — Stream logs
GET    /api/projects/:id/memory   — Query RAG memory
GET    /api/projects/:id/graph    — Get knowledge graph

GET    /api/health                — System health
GET    /api/metrics               — Resource usage
```

#### WebSocket Events
```
agent_status        — Agent status changed
task_update         — Task progress update
log_entry           — New log line
new_decision        — Decision requires attention
chat_message        — New chat message
resource_update     — RAM/VRAM/API usage changed
deployment_status   — Deployment progress
```

### 5.3 Data Flow

#### 5.3.1 Task Execution Flow
```
Sensei (Boss)
  → Task Queue (Redis)
    → Agent Worker
      → LLM Provider (selected by router)
        → Code/Suggestion generated
      → File System Tool
        → Code written/modified
      → Test Runner
        → Tests executed
      → Result stored
    → Task complete/failed
  → Memory updated
  → Dashboard notified (WebSocket)
  → Next task picked up
```

#### 5.3.2 Memory Flow
```
Code Change
  → AST Parser
    → Knowledge Graph updated (nodes/edges)
    → Code chunks embedded
      → RAG store updated (vector DB)
    → Learning extracted
      → Experience memory updated
  → Memory available for future queries
```

### 5.4 State Management

**Sensei State Machine:**
```
[Idle] → New Project → [Researching]
[Researching] → Complete → [Planning]
[Planning] → Debate Complete → [Implementing]
[Implementing] → All Tasks Done → [Testing]
[Testing] → All Pass → [Deploying]
[Testing] → Failures → [Implementing] (fix cycle)
[Deploying] → Success → [Monitoring]
[Monitoring] → New Request → [Planning]
[Monitoring] → Issues Found → [Implementing]
[Any State] → User Pause → [Paused]
[Paused] → User Resume → [Previous State]
```

**Task State Machine:**
```
[Pending] → Dependencies Met → [In Progress]
[In Progress] → Success → [Completed]
[In Progress] → Failure → [Failed]
[Failed] → Retry → [In Progress] (max attempts)
[Failed] → Max Retries → [Blocked]
[Any] → User Cancel → [Cancelled]
```

---

## 6. Error Handling

### 6.1 Error Types

| Error Code | Description | User Message | System Action |
|---|---|---|---|
| E001 | LLM Provider Unavailable | "Switching to backup AI model..." | Circuit breaker + failover |
| E002 | Task Execution Failed | "Retrying with adjusted approach..." | Auto-retry with new strategy |
| E003 | Resource Limit Reached | "Pausing to free up memory..." | Pause non-critical agents |
| E004 | Security Vulnerability | "Security issue found, fixing..." | Auto-fix or block commit |
| E005 | Dependency Conflict | "Trying alternative package..." | Try alternative, notify user |
| E006 | Syntax Error in Generated Code | "Fixing code syntax..." | Auto-fix, max 3 attempts |
| E007 | Test Suite Failure | "Debugging test failures..." | Analyze failure, generate fix |
| E008 | Deployment Failed | "Deployment issue, checking..." | Rollback, diagnose, retry |
| E009 | Human Approval Timeout | "Proceeding with default..." | Use highest-confidence option |
| E010 | Budget Limit Reached | "Switched to local models." | Disable cloud providers |

### 6.2 Recovery Mechanisms

**Auto-Recovery Levels:**
1. **Immediate (no user action):** Retry with different model, auto-fix syntax, try alternative package
2. **Deferred (notify user, continue other work):** Budget issues, low-confidence decisions
3. **Blocking (require user action):** Security critical, deployment failures, architecture decisions

---

## 7. Third-Party Integrations

### 7.1 LLM Providers

| Provider | Type | Use Case | Setup |
|---|---|---|---|
| Ollama | Local (primary) | Default for all tasks | Docker or native install |
| LM Studio | Local | Alternative local runner | Desktop app |
| llama.cpp | Local | Lightweight, minimal RAM | Binary + model file |
| vLLM | Local | High-throughput local serving | Docker |
| OpenAI | Cloud | Complex tasks, coding | API key |
| Anthropic | Cloud | Grandmasterure decisions | API key |
| Google Gemini | Cloud | Long context, research | API key |
| OpenRouter | Cloud | Unified API, cost optimization | API key |
| KoboldCPP | Local | Older GPU compatibility | Binary |

### 7.2 Vector Databases

| Provider | Type | Use Case |
|---|---|---|
| ChromaDB | Local (default) | Small-medium projects |
| Pinecone | Cloud | Large projects, team collaboration |
| Qdrant | Self-hosted | Privacy-sensitive projects |

### 7.3 Deployment Platforms

| Platform | Use Case |
|---|---|
| Vercel | Frontend deployments |
| Netlify | Static sites, JAMstack |
| Railway | Full-stack with database |
| Render | Docker-based deployments |
| AWS | Enterprise-scale infrastructure |
| Docker Hub | Container image hosting |

### 7.4 External Services

| Service | Purpose |
|---|---|
| GitHub/GitLab | Code repository, CI/CD |
| SendGrid/AWS SES | Email notifications |
| Sentry | Error tracking (post-deploy) |
| Stripe | Payment integration (if needed) |
| OSV Database | Dependency vulnerability scanning |

---

## 8. Accessibility & Internationalization

### 8.1 Accessibility

- WCAG 2.1 AA compliance for dashboard
- Keyboard navigation for all functions
- Screen reader support for status updates
- Color-blind friendly status indicators (icons + colors)
- Reduced motion option for animations

### 8.2 Internationalization

- Dashboard: English (v1), extensible to other languages
- Agent responses: English by default
- Code generation: Respects project language preferences

---

## 9. Deployment & Chunin DevOps

### 9.1 System Deployment

**CoNinja itself is deployed as:**
```
Docker Compose stack:
├── orchestrator (Python FastAPI)
├── dashboard (React static files served by Nginx)
├── redis (task queue + pub/sub)
├── chromadb (local vector database)
├── ollama (local LLM inference, optional)
└── nginx (reverse proxy + static serving)
```

### 9.2 CI/CD Pipeline

```
Code Push
  → Lint (flake8, black, prettier)
  → Unit Tests (pytest, jest)
  → Integration Tests (docker-compose test stack)
  → Security Scan (bandit, npm audit)
  → Build Docker images
  → Push to registry
  → Deploy to staging
  → E2E Tests (playwright)
  → Deploy to production (manual approval)
```

### 9.3 Monitoring

- Application: Prometheus + Grafana
- Logs: Structured JSON logging, centralized collection
- Errors: Sentry integration
- Taijutsu: Per-agent latency tracking, LLM response times
- Costs: Per-provider spend tracking with alerts

---

## 10. Future Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Core orchestrator with task queue
- [ ] 4 base agents: Grandmaster, Coder, Kunai Tester, Chunin DevOps
- [ ] Local LLM integration (Ollama)
- [ ] Basic file system tools
- [ ] Simple CLI interface
- [ ] Basic RAG with ChromaDB

### Phase 2: Intelligence (Weeks 3-4)
- [ ] Multi-provider LLM router
- [ ] Three-phase debate system
- [ ] Knowledge graph (NetworkX)
- [ ] Self-healing pipeline
- [ ] Git utilities
- [ ] Web dashboard (React)
- [ ] WebSocket real-time updates

### Phase 3: Autonomy (Weeks 5-6)
- [ ] 4 additional agents: Security, Scroll Keeper, Taijutsu, Recon Shinobi
- [ ] Continuous refinement loop
- [ ] A/B testing framework
- [ ] Security audit automation
- [ ] Scroll Keeper generation
- [ ] Competitive intelligence

### Phase 4: Scale (Weeks 7-8)
- [ ] Multi-project support
- [ ] Experience memory across projects
- [ ] Cost tracking and optimization
- [ ] Advanced deployment automation
- [ ] Plugin system for custom agents
- [ ] Mobile-responsive dashboard

### Phase 5: Polish (Weeks 9-10)
- [ ] Multi-modal input (images, PDFs)
- [ ] VS Code extension
- [ ] Advanced visualizations (agent network graph)
- [ ] Community agent marketplace
- [ ] Taijutsu optimization
- [ ] Comprehensive documentation

---

## 11. Technical Stack

### Backend Sensei
| Component | Technology | Reason |
|---|---|---|
| Language | Python 3.12 | Rich AI/ML ecosystem |
| API Framework | FastAPI | Async, auto-docs, performant |
| Task Queue | Redis + Celery | Battle-tested, Python-native |
| Database | SQLite (local) / PostgreSQL (scale) | Flexibility |
| Vector DB | ChromaDB (local) / Pinecone (cloud) | Hybrid approach |
| Knowledge Graph | NetworkX + optional Neo4j | Python-native, extensible |
| WebSocket | Socket.io | Real-time bidirectional |
| Auth | JWT + API keys | Simple, stateless |
| Config | Pydantic Settings | Type-safe configuration |
| Testing | pytest + pytest-asyncio | Async test support |

### Frontend Dashboard
| Component | Technology | Reason |
|---|---|---|
| Framework | React 18 + TypeScript | Type safety, ecosystem |
| Build Tool | Vite | Fast dev, optimized builds |
| Styling | Tailwind CSS | Utility-first, rapid UI |
| Components | shadcn/ui | Beautiful, accessible |
| State | Zustand | Lightweight, simple |
| Real-time | Socket.io client | Native WebSocket support |
| Charts | Recharts + D3.js | React-friendly + custom |
| Routing | React Router | Standard, feature-rich |
| Icons | Lucide React | Consistent, lightweight |
| Fonts | Inter (body) + JetBrains Mono (code) | Modern, readable |

### Chunin DevOps & Infrastructure
| Component | Technology | Reason |
|---|---|---|
| Container | Docker + Docker Compose | Standard, portable |
| Reverse Proxy | Nginx | Mature, performant |
| Monitoring | Prometheus + Grafana | Open-source standard |
| Logs | Structured JSON + Loki | Queryable, centralized |
| CI/CD | GitHub Actions | Free for open-source |

### LLM Integration
| Component | Technology | Reason |
|---|---|---|
| API Client | httpx (async) | Fast, async support |
| Provider Abstraction | Unified OpenAI-compatible API | Simplifies routing |
| Prompt Management | Jinja2 templates | Dynamic, maintainable |
| Response Parsing | Pydantic models | Type-safe parsing |
| Streaming | Server-Sent Events (SSE) | Real-time token streaming |

---

## 12. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Local LLM quality insufficient | Medium | High | Fallback to cloud providers; quality gates |
| Resource exhaustion (16GB RAM) | Medium | High | Dynamic agent scaling; resource monitoring |
| Generated code has bugs | High | Medium | Multi-layer testing; human review gates |
| Security vulnerability in generated code | Low | Critical | Security auditor agent; pre-commit scanning |
| API costs exceed budget | Medium | Medium | Cost tracking; local-first strategy |
| LLM provider rate limiting | Medium | Low | Circuit breaker; multiple providers |
| Complex project exceeds agent capabilities | Medium | High | Escalation to human; scope limitation |
| Hallucinated dependencies | Medium | Medium | Verify packages exist before install |
| User provides vague requirements | High | Medium | Recon Shinobi agent clarifies |

---

## 13. Glossary

| Term | Definition |
|---|---|
| **Agent** | An AI-powered specialized worker with a specific role (e.g., Coder, Kunai Tester) |
| **ADR** | Grandmasterure Decision Record — documents why a technical decision was made |
| **AST** | Abstract Syntax Tree — structured representation of code |
| **RAG** | Retrieval-Augmented Generation — enhancing LLM responses with retrieved context |
| **Knowledge Graph** | Graph database representing code entities and their relationships |
| **Sensei** | The central controller that manages agents, tasks, and decisions |
| **Swarm** | The collection of all agents working together on a project |
| **Debate** | Structured discussion where agents propose and evaluate alternatives |
| **Self-Healing** | Automatic recovery from failures without human intervention |
| **Circuit Breaker** | Pattern that stops calling failing services to prevent cascade failures |
| **Glassmorphism** | UI design style with translucent, blurred backgrounds |
| **Vibe Coder** | Slang for someone who codes by trial-and-error without deep understanding |
| **MCP** | Model Context Protocol — standard for AI tool integration |
