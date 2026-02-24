import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from './types';
import styles from './KanbanBoard.module.css';

interface CardProps {
  card: CardType;
  columnId: string;
  isDone?: boolean;
  onDelete: (columnId: string, cardId: string) => void;
  onUpdateTitle: (columnId: string, cardId: string, title: string) => void;
}

/**
 * Individual Kanban card component
 * Supports editing (double-click), deletion, and drag-and-drop
 */
export const Card = memo(function Card({
  card,
  columnId,
  isDone = false,
  onDelete,
  onUpdateTitle,
}: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      card,
      columnId,
    },
  });

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditTitle(card.title);
  }, [card.title]);

  const handleSave = useCallback(() => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onUpdateTitle(columnId, card.id, trimmed);
    }
    setIsEditing(false);
  }, [editTitle, card.id, columnId, onUpdateTitle]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditTitle(card.title);
  }, [card.title]);

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

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDelete(columnId, card.id);
    }
  }, [columnId, card.id, onDelete]);

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  const cardClassName = isDone ? styles.cardDone : styles.card;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
      className={cardClassName}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={styles.editInput}
        />
      ) : (
        <>
          <div className={styles.cardTitle}>
            {card.title}
          </div>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            aria-label="Delete card"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
});
