tsconfig.json — key options explained

- target: language features target (ES2022 is modern and safe for Vite builds).
- lib: includes DOM types for browser and ES2022 libs for new JS features.
- jsx: "react-jsx" enables the automatic JSX runtime (React 17+ style).
- module/moduleResolution: use ES modules compatible with Vite bundling.
- strict: enables strict TypeScript checks (recommended).
- noEmit: TypeScript will only typecheck, not emit JS (Vite handles bundling).
- include: only compile files under src (keeps build fast).

Tip: If strict is too strict while learning, you can set "strict": false temporarily.