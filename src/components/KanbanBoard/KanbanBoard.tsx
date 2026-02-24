import { useCallback, useReducer, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type { Card as CardType } from './types';
import { initialColumns } from './types';
import { boardReducer } from './reducer';
import { Column } from './Column';
import { Card } from './Card';
import styles from './KanbanBoard.module.css';

/**
 * Main KanbanBoard component
 * Provides drag-and-drop functionality for managing cards across columns
 */
export function KanbanBoard(): React.JSX.Element {
  const [columns, dispatch] = useReducer(boardReducer, initialColumns);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Configure drag sensors for better UX
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current as
      | { card: CardType; columnId: string }
      | undefined;

    if (activeData) {
      setActiveCard(activeData.card);
      setActiveColumnId(activeData.columnId);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCard(null);
    setActiveColumnId(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Get the card data from the active item
    const activeData = active.data.current as
      | { card: CardType; columnId: string }
      | undefined;
    if (!activeData) return;

    const { columnId: sourceColumnId } = activeData;

    // Find which column we're dropping into
    let targetColumnId: string;
    let targetIndex: number;

    // Check if dropping over another card
    const overData = over.data.current as
      | { card: CardType; columnId: string }
      | undefined;

    if (overData) {
      // Dropping over a card
      targetColumnId = overData.columnId;
      targetIndex = columns
        .find((col) => col.id === targetColumnId)
        ?.cards.findIndex((c) => c.id === overId) ?? 0;
    } else {
      // Dropping over a column
      targetColumnId = overId;
      targetIndex =
        columns.find((col) => col.id === targetColumnId)?.cards.length ?? 0;
    }

    // Only dispatch if actually moving
    if (sourceColumnId !== targetColumnId || activeId !== overId) {
      // If moving within the same column, adjust index
      if (sourceColumnId === targetColumnId) {
        const column = columns.find((col) => col.id === sourceColumnId);
        if (column) {
          const currentIndex = column.cards.findIndex((c) => c.id === activeId);
          const overIndex = column.cards.findIndex((c) => c.id === overId);

          // Adjust target index based on drag direction
          if (currentIndex < overIndex) {
            targetIndex = overIndex;
          } else {
            targetIndex = overIndex;
          }
        }
      }

      dispatch({
        type: 'MOVE_CARD',
        payload: {
          sourceColumnId,
          targetColumnId,
          cardId: activeId,
          targetIndex,
        },
      });
    }
  }, [columns]);

  const handleAddCard = useCallback((columnId: string, title: string) => {
    dispatch({
      type: 'ADD_CARD',
      payload: { columnId, title },
    });
  }, []);

  const handleDeleteCard = useCallback((columnId: string, cardId: string) => {
    dispatch({
      type: 'DELETE_CARD',
      payload: { columnId, cardId },
    });
  }, []);

  const handleUpdateCardTitle = useCallback(
    (columnId: string, cardId: string, title: string) => {
      dispatch({
        type: 'UPDATE_CARD_TITLE',
        payload: { columnId, cardId, title },
      });
    },
    []
  );

  return (
    <div className={styles.board}>
      <h1 className={styles.boardTitle}>Kanban Board</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.columnsContainer}>
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onUpdateCardTitle={handleUpdateCardTitle}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard && activeColumnId && (
            <div className={styles.dragOverlay}>
              <Card
                card={activeCard}
                columnId={activeColumnId}
                onDelete={handleDeleteCard}
                onUpdateTitle={handleUpdateCardTitle}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
