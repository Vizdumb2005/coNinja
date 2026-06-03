# Contributing to coNinja Dashboard

Welcome! This guide outlines our frontend development standards, folder structure conventions, styling guidelines, and contribution workflow.

---

## 1. Directory Structure & File Organization

To keep the codebase maintainable and organized, all source code must reside inside `codeweaver-dashboard/src/` and conform to the following directory layout:

```text
src/
├── components/   # Reusable React components (UI elements, layout parts)
├── hooks/        # Custom React hooks (stateful and lifecycle logic)
├── services/     # API request clients, external integrations, HTTP services
├── stores/       # Global state management stores (Zustand, Redux, Context, etc.)
└── utils/        # Pure helper utility functions (formatters, validators)
```

---

## 2. Naming Conventions

### Component Naming
- **PascalCase**: All React components and their corresponding files must be named in PascalCase.
  - *Example File*: `SwarmGraph.tsx`
  - *Example Export*: `export const SwarmGraph = () => { ... };`

### Utility & Hook Naming
- **camelCase**: Custom hooks, utilities, services, and generic files must use camelCase.
  - *Example Custom Hook*: `useSwarmData.ts`
  - *Example Utility*: `formatDate.ts`

---

## 3. CSS Styling & Naming Conventions

To prevent global namespace collisions and ensure style isolation, follow these practices:

### Option A: CSS Modules (Preferred)
Create component-scoped styles using `.module.css` extensions. 
- *File Name*: `SwarmGraph.module.css`
- *Usage*:
  ```tsx
  import styles from './SwarmGraph.module.css';

  export const SwarmGraph = () => (
    <div className={styles.container}>
      <span className={styles.title}>Swarm Status</span>
    </div>
  );
  ```

### Option B: BEM (Block Element Modifier)
If using global CSS stylesheets, always prefix class names using BEM to avoid selector leaks:
- **Block**: `swarm-graph` (Component or namespace root)
- **Element**: `swarm-graph__node` (Children within the block, prefixed by double underscore)
- **Modifier**: `swarm-graph__node--active` (States or variations, prefixed by double dash)
- *Example*:
  ```css
  .swarm-graph { /* block */ }
  .swarm-graph__node { /* element */ }
  .swarm-graph__node--active { /* modifier */ }
  ```

---

## 4. Development Workflow & Pull Requests

1. **Linting and Formatting**: Before committing, ensure the linter runs cleanly:
   ```bash
   npm run lint:all
   ```
2. **Type Checking**: Make sure there are no TypeScript compiler errors:
   ```bash
   npx tsc --noEmit
   ```
3. **Unit & E2E Testing**:
   - Run unit tests: `npm run test`
   - Run Playwright E2E tests: `npm run test:e2e`
4. **Commits**: Commits are automatically linted and formatted via pre-commit hooks (`husky` + `lint-staged`). Commits with failing tests or unformatted code will be blocked.
