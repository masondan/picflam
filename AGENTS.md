# picflam - Agents Guide

## Commands
- **Dev server**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (production build)
- **Lint**: `npm run lint` (ESLint)
- **Preview**: `npm run preview` (preview production build)
- **No tests configured**: This project has no test suite

## Architecture
- **Stack**: React 19 + Vite 7, no TypeScript
- **Structure**: Single-page app with canvas-based slide editor
  - `/src/components/` - React components (each with paired .jsx/.css files)
  - `/src/hooks/` - Custom hooks (useSlides, useLocalStorage)
  - `/src/utils/` - Utility functions (canvasUtils.js for drawing)
  - `/public/` - Static assets
- **State**: Local state with custom hooks, localStorage for persistence
- **Key features**: Drag-and-drop images, text editing, canvas export

## Code Style
- **Language**: JavaScript (ES modules), JSX for components
- **Imports**: React hooks first, then icons, then local components/hooks/utils
- **Components**: Functional components with forwardRef when needed
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Files**: Component pairs as ComponentName.jsx + ComponentName.css
- **ESLint**: Unused vars allowed if uppercase/underscore prefix
- **No comments**: Code should be self-explanatory
