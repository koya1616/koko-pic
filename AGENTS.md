# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the React + TypeScript UI (`App.tsx`, `main.tsx`, feature folders like `components/`, `screens/`, `context/`, `types/`).
- `src/assets/` and `public/` store frontend assets; `dist/` is build output.
- `src-tauri/` contains the Rust backend, build scripts, and config (`src-tauri/src/`, `src-tauri/tauri.conf.json`, `src-tauri/icons/`).
- `docs/` is for project documentation.

## Build, Test, and Development Commands
- `pnpm install`: install JS dependencies.
- `pnpm dev`: run the Vite dev server for the frontend.
- `pnpm build`: typecheck with `tsc` and build the production bundle.
- `pnpm preview`: serve the production build locally.
- `pnpm lint`: run Biome lint/format and TypeScript checks.
- `pnpm tauri dev`: run the full Tauri desktop app in dev mode.
- `pnpm tauri build`: build the native desktop app.

## Coding Style & Naming Conventions
- Formatting/linting is handled by Biome; indent style is tabs and strings use double quotes.
- Prefer TypeScript for all frontend code and keep components small and focused.
- Use `PascalCase` for React components and `camelCase` for functions/variables; keep file names aligned with exports (e.g., `PhotoCaptureScreen.tsx`).

## Testing Guidelines
- No automated test framework is configured yet. If you add tests, document the runner and wire it into a `pnpm test` script.
- Aim for test files co-located with features (for example, next to the component) and keep naming consistent.

## Commit & Pull Request Guidelines
- Recent history follows Conventional Commit-style prefixes like `refactor:` and `docs:`. Use `type: short description` in the imperative mood.
- PRs should include a concise description, linked issue (if any), and screenshots for UI changes.
- Call out any Tauri/Rust changes separately since they affect the desktop build.

## Configuration & Environment Notes
- Tauri requires Rust and the Tauri CLI; keep `src-tauri/` in sync with frontend changes.
- Vite configuration lives in `vite.config.ts`, and TS config in `tsconfig.json` and `tsconfig.node.json`.
