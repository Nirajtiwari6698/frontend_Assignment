# Frontend Developer Assignment

A React + TypeScript project with Tree View and Kanban Board components. Built with Vite and DnD Kit for drag-and-drop functionality.

## What's Inside

### Tree View

A hierarchical tree component with:
- Expand/collapse nodes
- Add, edit, delete nodes inline
- Drag and drop to reorder (same level)
- Lazy loading simulation
- TypeScript strict mode

### Kanban Board

A task board with three columns:
- Todo, In Progress, Done
- Add, edit, delete cards
- Drag and drop within and across columns
- Responsive layout

## Tech Stack

- React 19.2.0
- TypeScript 5.9.3 (strict mode)
- Vite 7.3.1
- DnD Kit for drag and drop
- React Router for navigation
- CSS Modules for styling

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at http://localhost:5173

### Build for production

```bash
npm run build
```

### Lint and format

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── app/
│   ├── App.tsx              - Main app with routing
│   └── App.module.css       - Global styles
├── components/
│   ├── KanbanBoard/
│   │   ├── KanbanBoard.tsx  - Board component
│   │   ├── Column.tsx       - Column component
│   │   ├── Card.tsx         - Card component
│   │   ├── reducer.ts       - State reducer
│   │   ├── types.ts         - TypeScript types
│   │   └── KanbanBoard.module.css
│   └── TreeView/
│       ├── TreeView.tsx     - Tree component
│       ├── SortableTreeNode.tsx
│       ├── tree.utils.ts    - Helper functions
│       ├── types.ts
│       └── TreeView.module.css
└── main.tsx
## Notes

Drag and drop in TreeView took longer than expected. Handling nested updates without mutating state was tricky at first.

I kept state local to components instead of adding Zustand since project size is small.

Cross-parent drag and drop logic exists in utils but I didn't finish wiring it due to time constraints.

## Future Work

- Complete cross-parent DnD in TreeView
- Improve mobile layout with proper media queries
- Add unit tests

## Links

- Live Demo: [add your deployed URL]
- GitHub: https://github.com/Nirajtiwari6698/frontend_Assignment
