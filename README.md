# Frontend Assignment

A production-ready React + TypeScript project with drag-and-drop functionality.

## Features

- React 18+ with TypeScript (strict mode)
- Vite build tool for fast development
- Drag & Drop with @dnd-kit
- ESLint + Prettier for code quality
- Absolute imports with path aliases
- CSS Modules for scoped styling
- Clean architecture with component folders

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Styling**: CSS Modules + CSS Variables
- **Utilities**: uuid, classnames
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/              # Application-level components
│   ├── App.tsx       # Root component
│   ├── routes.tsx    # Route configuration
│   └── index.ts      # App exports
├── components/       # Reusable components
│   ├── TreeView/
│   └── KanbanBoard/
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
├── styles/           # Global styles and CSS variables
└── assets/           # Static assets
```

## Absolute Imports

Configure your editor to recognize path aliases:

```typescript
// Instead of relative paths
import { TreeView } from '../../../components/TreeView'

// Use absolute imports
import { TreeView } from '@/components/TreeView'
```

## Development Guidelines

- Use functional components with explicit return types
- No `any` types allowed
- Use CSS Modules for component styling
- Follow strict TypeScript rules
- Keep components small and focused
- Use absolute imports for cross-module references

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

MIT
