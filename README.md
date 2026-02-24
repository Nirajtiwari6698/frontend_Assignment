# Frontend Developer Assignment

A React + TypeScript project with Tree View and Kanban Board components. Built with Vite and DnD Kit for drag-and-drop functionality.

---

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

---

## Tech Stack

- React 19.2.0
- TypeScript 5.9.3 (strict mode)
- Vite 7.3.1
- DnD Kit for drag and drop
- React Router for navigation
- CSS Modules for styling

---

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

---

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
```

---

## Implementation Notes

**What works well:**
- TypeScript is strict, no 'any' types
- State management is clean and immutable
- Drag and drop works for most cases
- UI is clean and minimal

**What could be improved:**
- TreeView cross-parent drag and drop is partially implemented (helper exists but not wired up)
- Mobile responsive design could use proper media queries
- No unit tests included
- Using native window.confirm() for delete confirmations

See IMPLEMENTATION_REPORT.md for more details.

---

## Future Improvements

- Complete cross-parent drag and drop in TreeView
- Add error boundaries
- Write unit tests
- Improve mobile layout with media queries
- Add toast notifications instead of confirm dialogs
- Virtualization for large lists

---

## Links

- Live Demo: [add your deployed URL]
- GitHub: [add your repo URL]

---

Built by Niraj | February 2026
