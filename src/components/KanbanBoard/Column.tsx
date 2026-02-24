import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from './KanbanBoard.module.css';
import type { Column as ColumnType } from './types';
import { Card } from './Card';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onUpdateCardTitle: (columnId: string, cardId: string, title: string) => void;
}

/**
 * Individual column component for the Kanban board
 * Handles card list rendering and add card functionality
 */
export const Column = memo(function Column({
  column,
  onAddCard,
  onDeleteCard,
  onUpdateCardTitle,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const cardIds = useMemo(
    () => column.cards.map((card) => card.id),
    [column.cards]
  );

  // Auto-focus input when entering add mode
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddClick = useCallback(() => {
    setIsAdding(true);
    setNewCardTitle('');
  }, []);

  const handleSave = useCallback(() => {
    const trimmed = newCardTitle.trim();
    if (trimmed) {
      onAddCard(column.id, trimmed);
    }
    setIsAdding(false);
    setNewCardTitle('');
  }, [column.id, newCardTitle, onAddCard]);

  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setNewCardTitle('');
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  // Get column variant class based on column id
  const columnClass = useMemo(() => {
    switch (column.id) {
      case 'todo':
        return `${styles.column} ${styles.columnTodo}`;
      case 'in-progress':
        return `${styles.column} ${styles.columnInProgress}`;
      case 'done':
        return `${styles.column} ${styles.columnDone}`;
      default:
        return styles.column;
    }
  }, [column.id]);

  return (
    <div className={columnClass}>
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span className={styles.columnTitleText}>{column.title}</span>
          <span className={styles.cardCount}>{column.cards.length}</span>
        </div>
        <button
          onClick={handleAddClick}
          className={styles.addButton}
          aria-label="Add card"
        >
          +
        </button>
      </div>

      {/* Cards List */}
      <div className={styles.cardsList}>
        <SortableContext
          items={cardIds}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              isDone={column.id === 'done'}
              onDelete={onDeleteCard}
              onUpdateTitle={onUpdateCardTitle}
            />
          ))}
        </SortableContext>

        {/* Add Card Input */}
        {isAdding && (
          <div className={styles.addCardForm}>
            <input
              ref={inputRef}
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder="Enter card title..."
              className={styles.addCardInput}
            />
            <div className={styles.addCardActions}>
              <button
                onClick={handleSave}
                className={styles.addCardButton}
              >
                Add Card
              </button>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
