# Tools Registry

Complete catalog of all tools available to CodeWeaver agents, organized by category.

## File System Tools

### read_file
```yaml
name: read_file
parameters:
  path: string        # Absolute or relative file path
  offset: integer     # Start line (1-based, optional)
  limit: integer      # Max lines to read (optional, default 1000)
returns:
  content: string     # File contents
  lines_read: integer # Number of lines returned
cost: simple          # Uses local model
```

### write_file
```yaml
name: write_file
parameters:
  path: string        # File path
  content: string     # File contents to write
returns:
  success: boolean    # Whether write succeeded
  path: string        # Written file path
safety:
  confirm_overwrite: true  # Confirm before overwriting existing files
cost: simple
```

### patch_file
```yaml
name: patch_file
parameters:
  path: string        # File to patch
  old_string: string  # Exact text to replace
  new_string: string  # Replacement text
  replace_all: boolean # Replace all occurrences (default false)
returns:
  success: boolean
  replacements: integer # Number of replacements made
safety:
  confirm_if_large: true   # Confirm if patch affects >50% of file
  ast_validation: true     # Validate patch doesn't break syntax
cost: medium
```

### list_files
```yaml
name: list_files
parameters:
  path: string        # Directory path
  recursive: boolean  # List subdirectories (default false)
  pattern: string     # Glob pattern filter (optional)
returns:
  files: array        # List of file entries with name, size, modified
cost: simple
```

### delete_file
```yaml
name: delete_file
parameters:
  path: string        # File to delete
returns:
  success: boolean
safety:
  confirm: true       # Always confirm before delete
cost: simple
```

### search_files
```yaml
name: search_files
parameters:
  path: string        # Directory to search
  pattern: string     # Search pattern (regex or text)
  file_pattern: string # File glob filter (optional)
  recursive: boolean  # Search subdirectories (default true)
returns:
  matches: array      # File, line, column, match text
cost: medium
```

## Terminal Tools

### run_command
```yaml
name: run_command
parameters:
  command: string     # Shell command to execute
  working_dir: string # Working directory (optional)
  timeout: integer    # Timeout in seconds (default 60)
  env: object         # Environment variables (optional)
returns:
  exit_code: integer  # Command exit code
  stdout: string      # Standard output
  stderr: string      # Standard error
  duration: float     # Execution time in seconds
safety:
  sandbox: true       # Execute in sandboxed environment
  forbidden_commands: ["rm -rf /", "mkfs", "dd", "format"]
cost: medium
```

## Git Tools

### git_init
```yaml
name: git_init
parameters:
  path: string        # Directory to initialize
returns:
  success: boolean
```

### git_status
```yaml
name: git_status
parameters:
  path: string        # Repository path
returns:
  branch: string      # Current branch
  modified: array     # Modified files
  staged: array       # Staged files
  untracked: array    # Untracked files
```

### git_add
```yaml
name: git_add
parameters:
  path: string        # Repository path
  files: array        # Files to stage
returns:
  success: boolean
```

### git_commit
```yaml
name: git_commit
parameters:
  path: string        # Repository path
  message: string     # Commit message
  author_name: string # Commit author (optional)
  author_email: string # Commit email (optional)
returns:
  success: boolean
  hash: string        # Commit hash
safety:
  auto_format: true   # Auto-format commit messages if needed
```

### git_diff
```yaml
name: git_diff
parameters:
  path: string        # Repository path
  from: string        # From commit/branch (optional, default HEAD)
  to: string          # To commit/branch (optional, default working)
  file: string        # Specific file (optional)
returns:
  diff: string        # Diff output
```

### git_branch
```yaml
name: git_branch
parameters:
  path: string        # Repository path
  action: enum        # list, create, delete, checkout
  name: string        # Branch name (for create/delete/checkout)
returns:
  success: boolean
  branches: array     # List of branches (for list action)
```

## Web Tools

### web_search
```yaml
name: web_search
parameters:
  query: string       # Search query
  num_results: integer # Max results (default 10)
  recency_days: integer # Filter by recency (optional)
returns:
  results: array      # Title, URL, snippet for each result
cost: medium
```

### fetch_url
```yaml
name: fetch_url
parameters:
  url: string         # URL to fetch
  method: enum        # GET, POST, PUT, DELETE (default GET)
  headers: object     # HTTP headers (optional)
  body: string        # Request body (optional)
  timeout: integer    # Timeout in seconds (default 30)
returns:
  status: integer     # HTTP status code
  headers: object     # Response headers
  body: string        # Response body
cost: medium
```

## Environment Tools

### check_port
```yaml
name: check_port
parameters:
  port: integer       # Port to check
  host: string        # Host (default localhost)
returns:
  available: boolean  # Whether port is available
  process: object     # Process using port (if occupied)
cost: simple
```

### http_ping
```yaml
name: http_ping
parameters:
  url: string         # URL to ping
  count: integer      # Number of pings (default 4)
returns:
  reachable: boolean  # Whether URL is reachable
  latency_ms: float   # Average latency
  status: integer     # HTTP status code
cost: simple
```

## Code Intelligence Tools

### ast_search
```yaml
name: ast_search
parameters:
  path: string        # File or directory to search
  query_type: enum    # find_function, find_class, find_imports, etc.
  name: string        # Name pattern (optional)
returns:
  results: array      # AST nodes with position info
cost: medium
```

### parse_dependencies
```yaml
name: parse_dependencies
parameters:
  path: string        # Project path
  language: enum      # javascript, python, go, rust
returns:
  dependencies: array # Package names and versions
  dev_dependencies: array
  outdated: array     # Outdated packages with latest version
cost: medium
```

### complexity_analysis
```yaml
name: complexity_analysis
parameters:
  path: string        # File or directory
returns:
  files: array        # Per-file complexity metrics
  cyclomatic: integer # Cyclomatic complexity
  cognitive: integer  # Cognitive complexity
  maintainability: float # Maintainability index
cost: medium
```

## LLM Tools

### query_llm
```yaml
name: query_llm
parameters:
  prompt: string      # Prompt to send
  provider: string    # Provider override (optional, auto-selected by default)
  model: string       # Model override (optional)
  system_prompt: string # System prompt (optional)
  temperature: float  # 0-2 (default 0.7)
  max_tokens: integer # Max response length (optional)
  stream: boolean     # Stream response (default true)
  context: array      # Context entries for RAG (optional)
returns:
  response: string    # LLM response
  usage: object       # Token usage stats
  provider: string    # Provider used
  model: string       # Model used
  cost: float         # Cost of this call
cost: varies          # Classified by task complexity
```

### generate_code
```yaml
name: generate_code
parameters:
  description: string # What code to generate
  language: string    # Programming language
  context: array      # Relevant code snippets for context
  tests: boolean      # Include tests (default true)
  style_guide: string # Style guide to follow (optional)
returns:
  code: string        # Generated code
  explanation: string # Explanation of the code
  tests: string       # Generated tests (if requested)
cost: medium
```

### review_code
```yaml
name: review_code
parameters:
  code: string        # Code to review
  language: string    # Programming language
  focus: array        # Areas to focus on [security, performance, style]
returns:
  issues: array       # Found issues with severity
  suggestions: array  # Improvement suggestions
  score: float        # Overall quality score (0-100)
cost: complex
```

## Database Tools

### db_query
```yaml
name: db_query
parameters:
  connection: string  # Connection string or alias
  query: string       # SQL query
  params: array       # Query parameters (optional)
returns:
  rows: array         # Query results
  columns: array      # Column names
  row_count: integer  # Number of rows
cost: medium
safety:
  read_only: true     # Only SELECT allowed by default
  confirm_write: true # Confirm for INSERT/UPDATE/DELETE
```

### db_schema
```yaml
name: db_schema
parameters:
  connection: string  # Connection string
returns:
  tables: array       # Table names
  schema: object      # Full schema with columns, types, constraints
cost: simple
```

## Security Tools

### scan_secrets
```yaml
name: scan_secrets
parameters:
  path: string        # File or directory to scan
  rules: array        # Secret patterns to check (optional, uses defaults)
returns:
  findings: array     # Found secrets with file, line, type
cost: medium
```

### check_vulnerabilities
```yaml
name: check_vulnerabilities
parameters:
  path: string        # Project path
  severity: enum      # minimum: low, medium, high, critical (default low)
returns:
  vulnerabilities: array # CVEs found with severity and fix
cost: medium
```

## Deployment Tools

### docker_build
```yaml
name: docker_build
parameters:
  path: string        # Path with Dockerfile
  tag: string         # Image tag
  build_args: object  # Build arguments (optional)
returns:
  success: boolean
  image_id: string    # Built image ID
  size_mb: float      # Image size
cost: complex
```

### docker_run
```yaml
name: docker_run
parameters:
  image: string       # Image to run
  ports: object       # Port mappings (host:container)
  env: object         # Environment variables
  volumes: object     # Volume mounts
  name: string        # Container name (optional)
returns:
  container_id: string
  status: string      # running, exited, etc.
cost: medium
```

### deploy_to_cloud
```yaml
name: deploy_to_cloud
parameters:
  platform: enum      # vercel, netlify, railway, render, aws
  path: string        # Project path
  config: object      # Platform-specific config
returns:
  url: string         # Deployment URL
  status: string      # deployment status
  logs: string        # Deployment logs
cost: complex
```
