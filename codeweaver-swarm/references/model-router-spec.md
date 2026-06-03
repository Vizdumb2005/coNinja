# Multi-Provider LLM Router Specification

This document defines the intelligent model routing system that selects the optimal LLM for each task based on complexity, resource availability, cost constraints, and model capabilities.

## Architecture

### Router Components

```
┌─────────────────────────────────────────┐
│          Model Router                   │
│  ┌──────────┐  ┌──────────┐           │
│  │  Task     │  │ Resource │           │
│  │Classifier │  │  Monitor  │           │
│  └────┬─────┘  └────┬─────┘           │
│       │             │                   │
│       └──────┬──────┘                   │
│              ▼                          │
│  ┌──────────────────────┐              │
│  │   Routing Decision    │              │
│  │   Engine              │              │
│  │  ┌────────────────┐  │              │
│  │  │ 1. Filter      │  │              │
│  │  │    (capability)│  │              │
│  │  │ 2. Rank        │  │              │
│  │  │    (quality/$) │  │              │
│  │  │ 3. Select      │  │              │
│  │  │    (best fit)  │  │              │
│  │  └────────────────┘  │              │
│  └──────────────────────┘              │
│              │                          │
│       ┌──────┴──────┐                   │
│       ▼             ▼                   │
│  ┌─────────┐  ┌─────────┐              │
│  │Circuit  │  │  Cost   │              │
│  │Breaker  │  │ Tracker │              │
│  └─────────┘  └─────────┘              │
└─────────────────────────────────────────┘
```

## Task Classification

### Complexity Levels

```python
class TaskComplexity(Enum):
    SIMPLE = "simple"       # Code formatting, text manipulation, comments
    MEDIUM = "medium"       # Component creation, API routes, queries
    COMPLEX = "complex"     # Architecture, algorithms, integrations
    CRITICAL = "critical"   # Security, auth, payments, data integrity
```

### Classification Rules

| Task Pattern | Keywords | Complexity |
|-------------|----------|------------|
| Format/lint/code style | "format", "lint", "style", "rename" | SIMPLE |
| Generate comments | "document", "comment", "explain" | SIMPLE |
| Simple CRUD | "create", "read", "update", "delete" + entity | MEDIUM |
| UI component | "component", "page", "form", "button" | MEDIUM |
| API endpoint | "endpoint", "route", "handler", "controller" | MEDIUM |
| Database query | "query", "migration", "index", "schema" | MEDIUM |
| Authentication | "auth", "login", "register", "password", "jwt" | CRITICAL |
| Authorization | "permission", "role", "access control", "rbac" | CRITICAL |
| Payment | "payment", "stripe", "billing", "subscription" | CRITICAL |
| Architecture | "architecture", "pattern", "structure", "design" | COMPLEX |
| Algorithm | "algorithm", "optimize", "sort", "search", "cache" | COMPLEX |
| Integration | "integrate", "webhook", "api", "third-party" | COMPLEX |
| Security audit | "security", "vulnerability", "sanitize", "encrypt" | CRITICAL |
| Testing | "test", "mock", "fixture", "coverage" | MEDIUM |
| Deployment | "deploy", "docker", "kubernetes", "pipeline" | COMPLEX |

## Provider Configuration

### Provider Definitions

```yaml
providers:
  # Local Providers (free, privacy-preserving)
  ollama:
    type: local
    endpoint: "http://localhost:11434"
    models:
      llama3.1:8b:
        context: 128000
        vram_required: 6
        quality_tier: 2
        speed_tier: 4
        best_for: [simple, medium]
      llama3.1:70b:
        context: 128000
        vram_required: 40
        quality_tier: 4
        speed_tier: 2
        best_for: [complex, critical]
      codellama:7b:
        context: 16000
        vram_required: 5
        quality_tier: 2
        speed_tier: 4
        best_for: [simple]
      codellama:13b:
        context: 16000
        vram_required: 9
        quality_tier: 3
        speed_tier: 3
        best_for: [medium]
      mistral:7b:
        context: 32000
        vram_required: 5
        quality_tier: 3
        speed_tier: 4
        best_for: [simple, medium]
      qwen2.5:14b:
        context: 128000
        vram_required: 10
        quality_tier: 3
        speed_tier: 3
        best_for: [medium, complex]
    default_model: llama3.1:8b
    circuit_breaker:
      failure_threshold: 5
      recovery_timeout: 60

  lmstudio:
    type: local
    endpoint: "http://localhost:1234"
    models:
      any-loaded:
        context: 128000
        vram_required: variable
        quality_tier: 3
        speed_tier: 3
        best_for: [simple, medium, complex]
    circuit_breaker:
      failure_threshold: 3
      recovery_timeout: 30

  llamacpp:
    type: local
    endpoint: "http://localhost:8080"
    models:
      any-loaded:
        context: 4096
        vram_required: variable
        quality_tier: 2
        speed_tier: 3
        best_for: [simple, medium]
    circuit_breaker:
      failure_threshold: 3
      recovery_timeout: 30

  vllm:
    type: local
    endpoint: "http://localhost:8000"
    models:
      any-served:
        context: 128000
        vram_required: variable
        quality_tier: 4
        speed_tier: 4
        best_for: [simple, medium, complex, critical]
    circuit_breaker:
      failure_threshold: 3
      recovery_timeout: 30

  # Cloud Providers (pay-per-use)
  openai:
    type: cloud
    models:
      gpt-4o:
        context: 128000
        cost_per_1k_input: 0.005
        cost_per_1k_output: 0.015
        quality_tier: 5
        speed_tier: 4
        best_for: [complex, critical]
      gpt-4o-mini:
        context: 128000
        cost_per_1k_input: 0.00015
        cost_per_1k_output: 0.0006
        quality_tier: 4
        speed_tier: 5
        best_for: [simple, medium, complex]
      o3-mini:
        context: 200000
        cost_per_1k_input: 0.0011
        cost_per_1k_output: 0.0044
        quality_tier: 5
        speed_tier: 3
        best_for: [complex, critical]
    circuit_breaker:
      failure_threshold: 3
      recovery_timeout: 60
    rate_limit: 500  # requests per minute

  anthropic:
    type: cloud
    models:
      claude-sonnet-4:
        context: 200000
        cost_per_1k_input: 0.003
        cost_per_1k_output: 0.015
        quality_tier: 5
        speed_tier: 3
        best_for: [complex, critical]
      claude-haiku:
        context: 200000
        cost_per_1k_input: 0.00025
        cost_per_1k_output: 0.00125
        quality_tier: 4
        speed_tier: 5
        best_for: [simple, medium]
    circuit_breaker:
      failure_threshold: 3
      recovery_timeout: 60
    rate_limit: 400

  gemini:
    type: cloud
    models:
      gemini-2.0-flash:
        context: 1048576
        cost_per_1k_input: 0.000075
        cost_per_1k_output: 0.0003
        quality_tier: 4
        speed_tier: 5
        best_for: [simple, medium, complex]
    circuit_breaker:
      failure_threshold: 3
      recovery_timeout: 60

  openrouter:
    type: cloud
    models:
      auto:
        context: 128000
        cost_per_1k_input: 0.001
        cost_per_1k_output: 0.002
        quality_tier: 4
        speed_tier: 4
        best_for: [simple, medium, complex, critical]
    circuit_breaker:
      failure_threshold: 5
      recovery_timeout: 30
```

## Routing Decision Algorithm

### Step 1: Filter by Capability

```python
def filter_by_capability(task_complexity, providers, available_vram):
    """Remove providers that can't handle this task."""
    capable = []
    
    for provider in providers:
        if provider.type == "local":
            # Check VRAM availability
            model = provider.get_recommended_model(task_complexity)
            if model.vram_required <= available_vram * 0.8:  # 80% threshold
                capable.append(provider)
        else:
            # Cloud providers can handle any complexity
            capable.append(provider)
    
    return capable
```

### Step 2: Rank by Quality/Cost

```python
def rank_providers(providers, task_complexity, budget_remaining):
    """Rank providers by best quality for the cost."""
    scores = []
    
    for provider in providers:
        model = provider.get_recommended_model(task_complexity)
        
        if provider.type == "local":
            # Local models: rank by quality * speed (free)
            score = model.quality_tier * model.speed_tier
            cost = 0
        else:
            # Cloud models: rank by quality / cost
            estimated_cost = estimate_cost(task_complexity, model)
            if estimated_cost > budget_remaining * 0.1:  # Don't spend >10% of remaining
                score = 0
            else:
                score = model.quality_tier / (estimated_cost + 0.001)
            cost = estimated_cost
        
        scores.append({
            "provider": provider,
            "model": model,
            "score": score,
            "cost": cost
        })
    
    return sorted(scores, key=lambda x: x["score"], reverse=True)
```

### Step 3: Select with Fallback Chain

```python
def select_provider(task, providers, resources, budget):
    """Select best provider with automatic fallback chain."""
    
    complexity = classify_task(task)
    capable = filter_by_capability(complexity, providers, resources.vram_gb)
    ranked = rank_providers(capable, complexity, budget.remaining)
    
    # Build fallback chain
    fallback_chain = []
    for entry in ranked[:3]:  # Top 3
        if entry["provider"].is_healthy():
            fallback_chain.append(entry)
    
    if not fallback_chain:
        # Emergency: use any available provider
        return get_emergency_provider(providers)
    
    # Return primary + fallback chain
    return {
        "primary": fallback_chain[0],
        "fallbacks": fallback_chain[1:],
        "estimated_cost": fallback_chain[0]["cost"]
    }
```

## Resource-Aware Scaling

### Hardware Profiles

```yaml
profiles:
  minimal:
    ram_gb: 16
    vram_gb: 6
    strategy: local-first
    max_local_agents: 3
    cloud_fallback: true
    preferred_models:
      simple: ollama/llama3.1:8b
      medium: ollama/mistral:7b
      complex: openai/gpt-4o-mini
      critical: openai/gpt-4o

  standard:
    ram_gb: 32
    vram_gb: 12
    strategy: balanced
    max_local_agents: 5
    cloud_fallback: true
    preferred_models:
      simple: ollama/mistral:7b
      medium: ollama/llama3.1:8b
      complex: ollama/qwen2.5:14b
      critical: anthropic/claude-sonnet-4

  powerful:
    ram_gb: 64
    vram_gb: 24
    strategy: local-preference
    max_local_agents: 8
    cloud_fallback: false
    preferred_models:
      simple: ollama/mistral:7b
      medium: ollama/llama3.1:8b
      complex: ollama/llama3.1:70b
      critical: vllm/any-served

  cloud-first:
    ram_gb: 16
    vram_gb: 0
    strategy: cloud-primary
    max_local_agents: 0
    cloud_fallback: false
    preferred_models:
      simple: gemini/gemini-2.0-flash
      medium: openai/gpt-4o-mini
      complex: anthropic/claude-sonnet-4
      critical: openai/gpt-4o
```

### Dynamic Adjustment

```python
def adjust_routing(resources):
    """Dynamically adjust routing based on current resource usage."""
    
    # If RAM usage > 85%, reduce local agent count
    if resources.ram_percent > 85:
        reduce_local_agents()
        prefer_cloud_models()
    
    # If VRAM usage > 90%, use smaller models or cloud
    if resources.vram_percent > 90:
        fallback_to_cloud()
        queue_non_urgent_tasks()
    
    # If API budget < 20% remaining, go local-only
    if budget.remaining_percent < 20:
        disable_cloud_providers()
        use_smallest_viable_model()
    
    # If provider has high latency, add to circuit breaker
    if provider.avg_latency > threshold:
        circuit_breaker.record_failure(provider)
```

## Circuit Breaker Implementation

### State Machine

```
[CLOSED] → failure_count >= threshold → [OPEN]
  ↑                                      |
  |                                      | timeout
  |                                      ▼
  └──── health_check passed ←──── [HALF_OPEN]
```

### Configuration

```python
class CircuitBreaker:
    def __init__(self, provider, config):
        self.provider = provider
        self.failure_threshold = config.failure_threshold
        self.recovery_timeout = config.recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, fn):
        if self.state == "OPEN":
            if time.now() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitOpenError(f"{self.provider.name} is unavailable")
        
        try:
            result = fn()
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise e
    
    def on_success(self):
        self.failure_count = 0
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
    
    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.now()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
```

## Cost Tracking

### Budget Management

```python
class BudgetManager:
    def __init__(self, daily_limit=5.0):
        self.daily_limit = daily_limit  # USD
        self.spent_today = 0.0
        self.requests_today = 0
    
    def can_spend(self, estimated_cost):
        """Check if we can afford this request."""
        return (self.spent_today + estimated_cost) < self.daily_limit
    
    def record_spend(self, provider, model, input_tokens, output_tokens):
        """Record actual spend."""
        cost = (input_tokens / 1000 * model.cost_per_1k_input +
                output_tokens / 1000 * model.cost_per_1k_output)
        self.spent_today += cost
        self.requests_today += 1
        return cost
    
    def get_status(self):
        return {
            "daily_limit": self.daily_limit,
            "spent": self.spent_today,
            "remaining": self.daily_limit - self.spent_today,
            "percent_used": self.spent_today / self.daily_limit * 100,
            "requests": self.requests_today
        }
```

### Cost Optimization Strategies

| Strategy | Implementation | Savings |
|----------|---------------|---------|
| Model cascading | Try cheap model first, escalate if quality poor | 30-50% |
| Response caching | Cache identical prompts (with TTL) | 10-20% |
| Batch requests | Group similar requests together | 15-25% |
| Prompt compression | Summarize context before sending | 5-15% |
| Local-first | Use local models for 80% of tasks | 60-80% |
| Streaming early exit | Cancel if output quality drops | 5-10% |

## Response Quality Scoring

### Quality Assessment

After each LLM call, score the response:

```python
class QualityAssessor:
    def assess(self, response, task_type):
        scores = {}
        
        # Format compliance (does it match expected format?)
        scores["format"] = self.check_format(response, task_type)
        
        # Completeness (did it address all requirements?)
        scores["completeness"] = self.check_completeness(response, task_type)
        
        # Correctness (is the code/logic correct?)
        scores["correctness"] = self.check_correctness(response, task_type)
        
        # Conciseness (no unnecessary verbosity)
        scores["conciseness"] = self.check_conciseness(response)
        
        return {
            "overall": sum(scores.values()) / len(scores),
            "breakdown": scores
        }
```

### Model Performance Tracking

Track per-model performance over time:

```python
class ModelPerformanceTracker:
    def __init__(self):
        self.model_stats = {}
    
    def record(self, provider, model, task_type, quality_score, latency, cost):
        key = f"{provider}/{model}/{task_type}"
        if key not in self.model_stats:
            self.model_stats[key] = {
                "calls": 0,
                "total_quality": 0,
                "total_latency": 0,
                "total_cost": 0
            }
        
        stats = self.model_stats[key]
        stats["calls"] += 1
        stats["total_quality"] += quality_score
        stats["total_latency"] += latency
        stats["total_cost"] += cost
    
    def get_best_model_for(self, task_type):
        """Get the best performing model for a task type."""
        relevant = {k: v for k, v in self.model_stats.items() 
                   if task_type in k}
        
        # Score = quality / (cost + latency_factor)
        ranked = sorted(relevant.items(),
                       key=lambda x: x[1]["total_quality"] / x[1]["calls"] / 
                                    (x[1]["total_cost"] / x[1]["calls"] + 0.001),
                       reverse=True)
        
        return ranked[0] if ranked else None
```

## Configuration Format

### Full Router Config

```yaml
model_router:
  # Budget settings
  budget:
    daily_limit_usd: 5.00
    alert_threshold: 80  # Alert at 80% of budget
    emergency_threshold: 95  # Disable cloud at 95%
  
  # Hardware profile (auto-detected or manual)
  hardware_profile: standard  # minimal, standard, powerful, cloud-first
  
  # Provider priority (overrides auto-selection)
  priority_order:
    - ollama
    - openai
    - anthropic
    - gemini
    - openrouter
  
  # Task type overrides (force specific models)
  task_overrides:
    security_audit:
      provider: anthropic
      model: claude-sonnet-4
    documentation:
      provider: ollama
      model: mistral:7b
  
  # Circuit breaker defaults
  circuit_breaker:
    failure_threshold: 5
    recovery_timeout: 60
    half_open_max_calls: 3
  
  # Caching
  cache:
    enabled: true
    ttl_seconds: 3600
    max_entries: 10000
  
  # Performance tracking
  tracking:
    enabled: true
    min_calls_before_optimization: 10
```

## Monitoring & Alerting

### Key Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|----------------|
| Router decision latency | Time to select provider | > 100ms |
| Provider failure rate | % failed calls per provider | > 10% |
| Average cost per request | Mean cost across all calls | > $0.05 |
| Cache hit rate | % requests served from cache | < 50% |
| Budget burn rate | % of daily budget used | > 80% |
| Model quality score | Average quality per model | < 3.5/5 |

### Dashboard Integration

The router exposes:
- Real-time provider health status
- Current routing decisions with rationale
- Cost breakdown by provider and task type
- Quality scores per model
- Circuit breaker states
- Cache statistics
