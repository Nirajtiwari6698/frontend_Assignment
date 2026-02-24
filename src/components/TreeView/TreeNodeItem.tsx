import { useState, useCallback, useMemo, memo } from 'react'
import type { FC, KeyboardEvent } from 'react'
import type { TreeNodeItemProps, EditingState } from './types'

import styles from './TreeView.module.css'

/**
 * Individual tree node item component
 * Handles rendering, expand/collapse, lazy loading, editing, and actions
 */
export const TreeNodeItem: FC<TreeNodeItemProps> = memo(
  ({ node, level, parentId, onUpdateNode, onAddNode, onDeleteNode, onMoveNode }) => {
    // Local state for editing
    const [editing, setEditing] = useState<EditingState | null>(null)

    // Check if children are not loaded yet (undefined means lazy load not triggered)
    const hasUnloadedChildren = node.children === undefined && node.isExpanded

    /**
     * Handle expand/collapse toggle
     * Triggers lazy loading on first expand if children are undefined
     */
    const handleToggle = useCallback(() => {
      if (hasUnloadedChildren) {
        // Trigger lazy loading
        onUpdateNode(node.id, { isLoading: true })

        // Simulate async loading
        setTimeout(() => {
          const mockChildren = Array.from({ length: 3 }, (_, i) => ({
            id: `child-${node.id}-${i}-${Date.now()}`,
            name: `Level A`,
            children: [],
            isExpanded: false,
          }))

          onUpdateNode(node.id, {
            children: mockChildren,
            isLoading: false,
          })
        }, 800)
      } else {
        onUpdateNode(node.id, { isExpanded: !node.isExpanded })
      }
    }, [hasUnloadedChildren, node.id, node.isExpanded, onUpdateNode])

    /**
     * Start editing node name (double-click)
     */
    const handleStartEdit = useCallback(() => {
      setEditing({
        nodeId: node.id,
        value: node.name,
        mode: 'rename',
      })
    }, [node.id, node.name])

    /**
     * Start adding new child node
     */
    const handleStartAdd = useCallback(() => {
      // Expand node first
      onUpdateNode(node.id, { isExpanded: true })
      setEditing({
        nodeId: node.id,
        value: '',
        mode: 'add',
      })
    }, [node.id, onUpdateNode])

    /**
     * Handle edit input changes
     */
    const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setEditing(prev => (prev ? { ...prev, value: e.target.value } : null))
    }, [])

    /**
     * Save edit on Enter key
     */
    const handleEditKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && editing?.value.trim()) {
          if (editing.mode === 'rename') {
            onUpdateNode(node.id, { name: editing.value.trim() })
          } else if (editing.mode === 'add') {
            onAddNode(node.id, editing.value.trim())
          }
          setEditing(null)
        } else if (e.key === 'Escape') {
          setEditing(null)
        }
      },
      [editing, node.id, onUpdateNode, onAddNode]
    )

    /**
     * Delete node with confirmation
     */
    const handleDelete = useCallback(
      () => {
        if (window.confirm(`Delete "${node.name}" and all its children?`)) {
          onDeleteNode(node.id)
        }
      },
      [node.id, node.name, onDeleteNode]
    )

    // Determine if we should render children
    const shouldRenderChildren = node.isExpanded && node.children && node.children.length > 0

    // Calculate indentation based on level
    const indentStyle = useMemo(() => ({
      paddingLeft: `${level * 24}px`,
    }), [level])

    // Is this node currently being edited
    const isEditing = editing?.nodeId === node.id
    const isEditingRename = isEditing && editing?.mode === 'rename'
    const isEditingAdd = isEditing && editing?.mode === 'add'

    return (
      <div className={styles.nodeContainer}>
        {/* Main node row */}
        <div className={styles.nodeRow} style={indentStyle}>
          {/* Expand/Collapse button */}
          <button
            className={styles.toggleButton}
            onClick={handleToggle}
            disabled={node.isLoading}
            aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
            type="button"
          >
            {node.isLoading ? (
              <span className={styles.spinner}>⟳</span>
            ) : node.children && node.children.length > 0 ? (
              <span className={node.isExpanded ? styles.expanded : styles.collapsed}>
                {node.isExpanded ? '▼' : '▶'}
              </span>
            ) : (
              <span className={styles.leaf}>•</span>
            )}
          </button>

          {/* Node icon (colored circle with letter) */}
          <div className={`${styles.nodeIcon} ${styles[`level${level % 4}`]}`}>
            {node.name.charAt(0).toUpperCase()}
          </div>

          {/* Node name or edit input */}
          {isEditingRename ? (
            <input
              className={styles.editInput}
              type="text"
              value={editing?.value ?? ''}
              onChange={handleEditChange}
              onKeyDown={handleEditKeyDown}
              onBlur={() => setEditing(null)}
              autoFocus
            />
          ) : (
            <span className={styles.nodeName} onDoubleClick={handleStartEdit}>
              {node.name}
            </span>
          )}

          {/* Action buttons */}
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={handleStartAdd}
              aria-label="Add child"
              type="button"
            >
              +
            </button>
            {parentId !== null && (
              <button
                className={`${styles.actionButton} ${styles.delete}`}
                onClick={handleDelete}
                onPointerDown={e => e.stopPropagation()}
                aria-label="Delete"
                type="button"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Add new child input (inline) */}
        {isEditingAdd && (
          <div className={styles.nodeRow} style={{ paddingLeft: `${(level + 1) * 24}px` }}>
            <div className={`${styles.nodeIcon} ${styles.newNode}`}>+</div>
            <input
              className={styles.editInput}
              type="text"
              value={editing?.value ?? ''}
              onChange={handleEditChange}
              onKeyDown={handleEditKeyDown}
              onBlur={() => setEditing(null)}
              placeholder="New node name..."
              autoFocus
            />
          </div>
        )}

        {/* Children */}
        {shouldRenderChildren && (
          <div className={styles.children}>
            {node.children!.map(child => (
              <TreeNodeItem
                key={child.id}
                node={child}
                level={level + 1}
                parentId={node.id}
                onUpdateNode={onUpdateNode}
                onAddNode={onAddNode}
                onDeleteNode={onDeleteNode}
                onMoveNode={onMoveNode}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

TreeNodeItem.displayName = 'TreeNodeItem'
