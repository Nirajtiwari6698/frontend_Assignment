/**
 * Core type definitions for the KanbanBoard component
 * Strictly typed interfaces following TypeScript strict mode
 */

/** Represents a single card in the Kanban board */
export interface Card {
  id: string;
  title: string;
}

/** Represents a column containing cards */
export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

/** Initial mock data for the Kanban board */
export const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: 'card-1', title: 'Create initial project plan' },
      { id: 'card-2', title: 'Design landing page' },
      { id: 'card-3', title: 'Review codebase structure' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      { id: 'card-4', title: 'Implement authentication' },
      { id: 'card-5', title: 'Set up database schema' },
      { id: 'card-6', title: 'Fix navbar bugs' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'card-7', title: 'Organize project repository' },
      { id: 'card-8', title: 'Write API documentation' },
    ],
  },
];

/** Action types for the board reducer */
export type BoardAction =
  | { type: 'ADD_CARD'; payload: { columnId: string; title: string } }
  | { type: 'DELETE_CARD'; payload: { columnId: string; cardId: string } }
  | { type: 'UPDATE_CARD_TITLE'; payload: { columnId: string; cardId: string; title: string } }
  | { type: 'MOVE_CARD'; payload: { sourceColumnId: string; targetColumnId: string; cardId: string; targetIndex: number } };
