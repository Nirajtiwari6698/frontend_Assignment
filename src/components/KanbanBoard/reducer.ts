import { v4 as uuidv4 } from 'uuid';
import type { BoardAction, Card, Column } from './types';

/**
 * Reducer function for managing Kanban board state
 * All state updates are immutable
 * @param state - Current columns state
 * @param action - Board action to perform
 * @returns New columns state
 */
export function boardReducer(state: Column[], action: BoardAction): Column[] {
  switch (action.type) {
    case 'ADD_CARD': {
      const { columnId, title } = action.payload;
      const newCard: Card = {
        id: `card-${uuidv4()}`,
        title: title.trim(),
      };

      return state.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      );
    }

    case 'DELETE_CARD': {
      const { columnId, cardId } = action.payload;

      return state.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      );
    }

    case 'UPDATE_CARD_TITLE': {
      const { columnId, cardId, title } = action.payload;
      const trimmedTitle = title.trim();

      if (!trimmedTitle) return state;

      return state.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId ? { ...card, title: trimmedTitle } : card
              ),
            }
          : column
      );
    }

    case 'MOVE_CARD': {
      const { sourceColumnId, targetColumnId, cardId, targetIndex } = action.payload;

      // Find the card being moved
      const sourceColumn = state.find((col) => col.id === sourceColumnId);
      if (!sourceColumn) return state;

      const cardToMove = sourceColumn.cards.find((card) => card.id === cardId);
      if (!cardToMove) return state;

      // Moving within the same column
      if (sourceColumnId === targetColumnId) {
        const cards = [...sourceColumn.cards];
        const sourceIndex = cards.findIndex((card) => card.id === cardId);
        if (sourceIndex === -1) return state;

        // Remove from source index and insert at target index
        cards.splice(sourceIndex, 1);
        cards.splice(targetIndex, 0, cardToMove);

        return state.map((column) =>
          column.id === sourceColumnId ? { ...column, cards } : column
        );
      }

      // Moving to a different column
      return state.map((column) => {
        if (column.id === sourceColumnId) {
          // Remove from source column
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          };
        }
        if (column.id === targetColumnId) {
          // Insert into target column at specified index
          const newCards = [...column.cards];
          newCards.splice(targetIndex, 0, cardToMove);
          return { ...column, cards: newCards };
        }
        return column;
      });
    }

    default:
      return state;
  }
}
