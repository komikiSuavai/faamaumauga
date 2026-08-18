package.json — explanations and notes

- scripts:
  - dev: starts the Vite dev server (fast HMR for development).
  - build: creates a production build in the `dist` folder.
  - preview: serves the production build locally for verification.
  - typecheck: runs TypeScript compiler checks without emitting files.
  - lint: runs ESLint over src files (adjust glob if you add other folders).
  - format: runs Prettier to auto-format code.
  - test: runs Vitest (unit/component tests).

- dependencies:
  - react, react-dom: core React packages.
  - react-router-dom: client-side routing.
  - zustand: lightweight state management.
  - axios: HTTP client (used by the example apiClient).

- devDependencies:
  - vite, @vitejs/plugin-react: Vite and React plugin.
  - typescript and @types/*: TypeScript + type definitions.
  - tailwindcss, postcss, autoprefixer: Tailwind setup.
  - eslint, prettier, eslint-config-prettier: linting and formatting.
  - vitest and testing-library: tests.

Tip: If you prefer npm or yarn, you can still use these files; just install deps with `npm install` or `yarn`.