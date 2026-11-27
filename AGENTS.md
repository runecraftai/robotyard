# Project agent memory

This file is the project's committed base for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## Commands

- Full gate: `bun run typecheck && bun run lint && bun run test && bun run build`. Boundary proof alone: `bun run boundary` (`tools/boundary-check/run.sh`).
- Server tests run under Bun (`bun test`, `apps/server/package.json`) because the daemon database uses `bun:sqlite`, which vitest cannot load under Node. The other workspaces stay on vitest.
- Migrations: `bun run db:migrate` in `apps/server` writes `.data/robotyard.db`; the schema is `apps/server/src/daemon/db/schema.ts` and `bun run db:generate` regenerates SQL via drizzle-kit.

## Architecture sharp edges

- The gateway/daemon split is enforced by disjoint `composite` projects (`tsconfig.gateway.json`, `tsconfig.daemon.json`); a cross import fails with TS6307. `bun run boundary` proves both directions and also proves the gateway lint ban on `drizzle-orm`.
- The daemon owns the database under `apps/server/src/daemon/db`; the gateway must not import it. `apps/server/.oxlintrc.json` enforces the package import the file-list check cannot see.
- `apps/web` uses a code-based TanStack Router tree in `apps/web/src/router.tsx`; routes live in `apps/web/src/routes`, and the `Register` declaration makes link paths and params typechecked.
- Both design variants are resolved at load in `packages/ui/src/tokens.ts`; no runtime code reads the active theme.
- `apps/desktop` is a deliberate stub: `packageDesktop()` throws until the wrapper is decided.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
