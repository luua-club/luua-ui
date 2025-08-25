# Luua UI

Minimal React + Vite + TypeScript UI for Luua.

Testing URL: https://luua-ui.onrender.com/login

## Prerequisites

- Node: 22.14.0 (see `.nvmrc` / `.node-version`)
- pnpm: 10.x (repo uses `packageManager: pnpm@10.12.4`)
- Only pnpm is allowed (`preinstall` uses `only-allow`)

## Install & Run

```bash
# install deps
pnpm install

# start dev server (Vite on http://localhost:3000)
pnpm dev

# type-check + build for production
pnpm build

# preview production build locally
pnpm preview

# lint and format
pnpm lint
pnpm format
```

## Project Scripts (`package.json`)

- `dev`: Vite dev server
- `build`: TypeScript build + Vite build
- `preview`: Vite preview
- `lint` / `lint:fix`: ESLint
- `format` / `format:check`: Prettier (+ ESLint fix)
- `prepare`: Husky install (git hooks)

## Tech Stack

- React 19, React DOM 19
- Vite 6, TypeScript ~5.8
- Tailwind CSS v4
- TanStack Router and Query
- Redux Toolkit
- React Hook Form + Zod
- Radix UI Primitives

## Notes

- Dev server runs on port `3000` (`vite.config.ts`).
- Commit hooks via Husky and formatting via lint-staged are enabled.
- If Node version issues arise, use `nvm use` (reads `.nvmrc`).
