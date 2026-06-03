# Hybrid Memory System Specification

This document defines the dual-layer memory architecture combining Vector RAG and Knowledge Graph for intelligent code understanding.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Hybrid Memory System             │
│                                          │
│  ┌──────────────┐  ┌────────────────┐  │
│  │  Vector RAG   │  │ Knowledge Graph │  │
│  │  ("Find       │  │ ("Understand    │  │
│  │   similar")   │  │  relationships")│  │
│  │              │  │                │  │
│  │  ChromaDB    │  │  NetworkX      │  │
│  │  (local)     │  │  (local)       │  │
│  │  Pinecone    │  │  Neo4j         │  │
│  │  (cloud)     │  │  (cloud)       │  │
│  └──────┬───────┘  └────────┬───────┘  │
│         │                   │           │
│         └───────┬───────────┘           │
│                 ▼                       │
│         ┌──────────────┐               │
│         │   Unified    │               │
│         │   Query API  │               │
│         └──────────────┘               │
└─────────────────────────────────────────┘
```

## Layer 1: Vector RAG

### Purpose
Find semantically similar content — "What code looks like this query?"

### Use Cases
- Finding similar code snippets
- Locating relevant documentation
- Retrieving past error solutions
- Matching natural language queries to code

### Data Model

```python
class MemoryEntry:
    id: str                    # UUID
    project_id: str            # Project reference
    agent_id: Optional[str]    # Which agent created this
    entry_type: EntryType      # code_snippet, error_pattern, decision, etc.
    content: str               # The actual text content
    embedding: List[float]     # 1536-dimension vector
    metadata: Dict             # Context information
    importance: float          # 0-1 calculated importance
    created_at: datetime
    access_count: int          # For LRU eviction
    last_accessed: datetime
```

### Entry Types

| Type | Description | Example |
|------|-------------|---------|
| `code_snippet` | Reusable code patterns | "Auth middleware pattern" |
| `error_pattern` | Known errors and solutions | "Prisma connection pool error" |
| `decision` | Architecture decisions | "Why we chose PostgreSQL" |
| `learning` | Lessons from failures | "Don't use floating point for money" |
| `conversation` | Important chat context | "User wants dark mode" |
| `document` | Project documentation | "API endpoint definitions" |
| `convention` | Code style decisions | "Use PascalCase for components" |

### Chunking Strategy

```python
class ChunkingStrategy:
    """Different chunking for different content types."""
    
    def chunk_code(self, file_path, content):
        """Chunk by function/class with surrounding context."""
        # Use AST to find function/class boundaries
        # Include imports and docstring in chunk
        # Target: 500-1500 tokens per chunk
        pass
    
    def chunk_documentation(self, content):
        """Chunk by section/paragraph."""
        # Split by headers
        # Keep sections intact when possible
        pass
    
    def chunk_conversation(self, messages):
        """Chunk by topic thread."""
        # Group related messages
        # Include context (2 messages before/after)
        pass
```

### Retrieval

```python
def query_rag(project_id, query, top_k=5, filters=None):
    """
    Query the vector database for relevant context.
    
    Args:
        project_id: Scope to specific project
        query: Natural language or code query
        top_k: Number of results
        filters: Optional metadata filters
        
    Returns:
        List of MemoryEntry with similarity scores
    """
    # 1. Embed the query
    query_embedding = embedding_model.encode(query)
    
    # 2. Search vector database
    results = vector_db.similarity_search(
        embedding=query_embedding,
        filter={"project_id": project_id, **filters},
        top_k=top_k
    )
    
    # 3. Rerank by importance and recency
    results = rerank(results, query)
    
    # 4. Update access metrics
    for r in results:
        r.access_count += 1
        r.last_accessed = now()
    
    return results
```

### Reranking Strategy

```python
def rerank(results, query):
    """Combine multiple signals for better ranking."""
    for r in results:
        # Base: Semantic similarity
        score = r.similarity_score
        
        # Boost: Importance (high = more important)
        score *= (0.5 + 0.5 * r.importance)
        
        # Boost: Recency (newer = slightly more relevant)
        age_hours = (now() - r.created_at).total_seconds() / 3600
        recency_boost = max(0.5, 1.0 - age_hours / 168)  # Decay over 1 week
        score *= recency_boost
        
        # Boost: Access frequency (frequently accessed = important)
        access_boost = min(1.5, 1.0 + r.access_count * 0.01)
        score *= access_boost
        
        r.final_score = score
    
    return sorted(results, key=lambda x: x.final_score, reverse=True)
```

---

## Layer 2: Knowledge Graph

### Purpose
Understand relationships between code entities — "What depends on what I want to change?"

### Use Cases
- Impact analysis ("What breaks if I change X?")
- Code navigation ("Where is this function used?")
- Architecture understanding
- Dependency visualization
- Refactoring planning

### Node Types

```python
class NodeType(Enum):
    FILE = "file"                    # Source files
    FUNCTION = "function"            # Functions/methods
    CLASS = "class"                  # Classes/interfaces
    VARIABLE = "variable"            # Variables/constants
    API_ENDPOINT = "api_endpoint"    # REST/GraphQL endpoints
    DATABASE_TABLE = "db_table"      # Database tables
    DATABASE_COLUMN = "db_column"    # Table columns
    COMPONENT = "component"          # React/Vue components
    ENV_VARIABLE = "env_var"         # Environment variables
    PACKAGE = "package"              # NPM/pip packages
    CONFIG = "config"                # Configuration files
```

### Edge Types

```python
class EdgeType(Enum):
    IMPORTS = "imports"              # File A imports File B
    CALLS = "calls"                  # Function A calls Function B
    INHERITS_FROM = "inherits_from"  # Class A extends Class B
    DEPENDS_ON = "depends_on"        # Generic dependency
    EXPOSES = "exposes"              # File exposes API endpoint
    USES = "uses"                    # Uses variable/table/package
    TESTS = "tests"                  # Test file tests source file
    CONTAINS = "contains"            # File contains Function/Class
    REFERENCES = "references"        # References env variable
    IMPLEMENTS = "implements"        # Implements interface
```

### Graph Schema

```cypher
// Example Cypher-style queries (for Neo4j)

// What functions does this file contain?
MATCH (f:FILE {path: "src/auth.ts"})-[:CONTAINS]->(fn:FUNCTION)
RETURN fn.name, fn.signature

// Where is this function called?
MATCH (caller)-[:CALLS]->(fn:FUNCTION {name: "authenticate"})
RETURN caller.path, caller.name

// What depends on the User model?
MATCH (dep)-[:DEPENDS_ON]->(c:CLASS {name: "User"})
RETURN dep.path, dep.name, dep.type

// What's the full dependency chain for this endpoint?
MATCH path = (ep:API_ENDPOINT {path: "/api/login"})-[:DEPENDS_ON|CALLS*]->(dep)
RETURN path

// Find dead code (functions never called)
MATCH (fn:FUNCTION)
WHERE NOT ()-[:CALLS]->(fn) AND fn.visibility = "private"
RETURN fn.name, fn.file
```

### Graph Construction

```python
class KnowledgeGraphBuilder:
    def __init__(self):
        self.graph = nx.DiGraph()
    
    def parse_file(self, file_path, content):
        """Parse a source file and add nodes/edges to graph."""
        language = detect_language(file_path)
        
        # Parse AST
        ast = parse_ast(content, language)
        
        # Add file node
        file_node = self.add_node(NodeType.FILE, {
            "path": file_path,
            "language": language,
            "size": len(content)
        })
        
        # Extract and add child nodes
        for func in extract_functions(ast):
            func_node = self.add_node(NodeType.FUNCTION, func)
            self.add_edge(file_node, func_node, EdgeType.CONTAINS)
        
        for cls in extract_classes(ast):
            cls_node = self.add_node(NodeType.CLASS, cls)
            self.add_edge(file_node, cls_node, EdgeType.CONTAINS)
        
        # Extract import relationships
        for imp in extract_imports(ast):
            target = self.find_or_create_node(NodeType.FILE, {"path": imp.path})
            self.add_edge(file_node, target, EdgeType.IMPORTS)
        
        # Extract call relationships
        for call in extract_calls(ast):
            caller = self.find_node_at_position(file_path, call.line)
            target = self.find_node_by_name(NodeType.FUNCTION, call.name)
            if caller and target:
                self.add_edge(caller, target, EdgeType.CALLS)
    
    def impact_analysis(self, changed_node):
        """Find all nodes affected by changing a node."""
        # BFS to find all dependents
        affected = set()
        queue = [changed_node]
        
        while queue:
            node = queue.pop(0)
            for successor in self.graph.successors(node):
                if successor not in affected:
                    affected.add(successor)
                    queue.append(successor)
        
        return affected
```

### Graph Queries

```python
class GraphQueries:
    def __init__(self, graph):
        self.graph = graph
    
    def find_dependents(self, node_id):
        """Find all nodes that depend on this node."""
        return list(nx.ancestors(self.graph, node_id))
    
    def find_dependencies(self, node_id):
        """Find all nodes this node depends on."""
        return list(nx.descendants(self.graph, node_id))
    
    def find_dead_code(self):
        """Find functions that are never called."""
        dead = []
        for node in self.graph.nodes():
            if node.type == NodeType.FUNCTION:
                if self.graph.in_degree(node) == 0 and node.visibility == "private":
                    dead.append(node)
        return dead
    
    def find_circular_dependencies(self):
        """Detect circular import/dependency cycles."""
        return list(nx.simple_cycles(self.graph))
    
    def get_call_graph(self, entry_point):
        """Get the call graph starting from an entry point."""
        return nx.dfs_tree(self.graph, entry_point)
    
    def centrality_analysis(self):
        """Find the most important nodes (highly connected)."""
        centrality = nx.betweenness_centrality(self.graph)
        return sorted(centrality.items(), key=lambda x: x[1], reverse=True)
```

---

## Unified Memory API

### Query Interface

```python
class UnifiedMemory:
    def __init__(self, vector_db, knowledge_graph):
        self.rag = vector_db
        self.kg = knowledge_graph
    
    def query(self, project_id, question, mode="auto"):
        """
        Unified query interface.
        
        Modes:
        - "similarity": RAG-only (find similar content)
        - "relational": KG-only (find relationships)
        - "auto": Both layers combined
        """
        if mode in ("similarity", "auto"):
            rag_results = self.rag.query(project_id, question)
        
        if mode in ("relational", "auto"):
            kg_results = self.kg.query(question)
        
        if mode == "auto":
            return self.merge_results(rag_results, kg_results)
        
        return rag_results if mode == "similarity" else kg_results
    
    def before_change(self, project_id, file_path, change_description):
        """
        Impact analysis before making a change.
        
        Returns:
            {
                "files_affected": [...],
                "tests_to_run": [...],
                "risks": [...],
                "recommendations": [...]
            }
        """
        # Find the node in the graph
        node = self.kg.find_node(NodeType.FILE, {"path": file_path})
        
        # Get all dependents
        dependents = self.kg.impact_analysis(node)
        
        # Find related test files
        tests = [d for d in dependents if d.type == NodeType.FILE and "test" in d.path]
        
        # Get relevant context from RAG
        context = self.rag.query(project_id, f"changes to {file_path} {change_description}")
        
        return {
            "files_affected": dependents,
            "tests_to_run": tests,
            "risks": self.assess_risks(dependents),
            "relevant_context": context
        }
    
    def learn_from_result(self, project_id, task, result, outcome):
        """
        Store the outcome of a task for future learning.
        
        Args:
            task: What was attempted
            result: What happened
            outcome: "success" or "failure"
        """
        entry = MemoryEntry(
            project_id=project_id,
            entry_type=EntryType.LEARNING,
            content=f"Task: {task}\nResult: {result}\nOutcome: {outcome}",
            importance=0.9 if outcome == "failure" else 0.6,
            metadata={
                "task_type": task.type,
                "outcome": outcome,
                "technologies": extract_technologies(task)
            }
        )
        
        self.rag.store(entry)
```

### Reflection Synthesis

After completing a task, the system extracts and stores lessons:

```python
def reflect_on_task(task, result, agent_logs):
    """Extract lessons from completed work."""
    
    reflection = {
        "task": task.description,
        "approach": task.strategy,
        "outcome": result.status,
        "time_taken": result.duration,
        "retries": result.attempts,
        "lessons": []
    }
    
    # Extract lessons based on outcome
    if result.status == "success":
        if result.duration < task.estimated_duration * 0.5:
            reflection["lessons"].append(
                f"{task.strategy} was faster than expected for {task.type}"
            )
    elif result.status == "failure":
        reflection["lessons"].append(
            f"{task.strategy} failed for {task.type}: {result.error}"
        )
        reflection["lessons"].append(
            f"Alternative approach: {suggest_alternative(task, result.error)}"
        )
    
    # Store in memory
    memory.store(MemoryEntry(
        entry_type=EntryType.LEARNING,
        content=json.dumps(reflection),
        importance=0.8 if result.status == "failure" else 0.5
    ))
    
    return reflection
```

---

## Implementation Notes

### Local Setup (Default)

```python
# ChromaDB for vector search
import chromadb
chroma_client = chromadb.PersistentClient(path="./data/chroma")

# NetworkX for knowledge graph
import networkx as nx
graph = nx.DiGraph()

# Sentence transformers for embeddings
from sentence_transformers import SentenceTransformer
embedder = SentenceTransformer('all-MiniLM-L6-v2')  # 384-dim, fast
```

### Cloud Setup (Scale)

```python
# Pinecone for vector search
import pinecone
pinecone.init(api_key="...", environment="us-west1-gcp")

# Neo4j for knowledge graph
from neo4j import GraphDatabase
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
```

### Memory Persistence

```
Workspace structure:
├── .codeweaver/
│   ├── memory/
│   │   ├── chroma/           # Vector database files
│   │   ├── graph.json        # Knowledge graph (NetworkX)
│   │   ├── decisions/        # Architecture decision records
│   │   └── reflections/      # Learned lessons
│   ├── state/
│   │   ├── checkpoint.json   # Current execution state
│   │   └── history.jsonl     # Action history
│   └── cache/
│       └── llm_responses/    # Cached LLM responses
```
