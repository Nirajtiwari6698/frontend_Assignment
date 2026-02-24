import { useState, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import type { TreeViewProps, TreeNode } from './types'
import { SortableTreeNode } from './SortableTreeNode'
import {
  updateNodeById,
  addChildNode,
  deleteNodeById,
  reorderNodes,
  createNode,
} from './tree.utils'

import styles from './TreeView.module.css'

/**
 * Main TreeView component with DnD Kit integration
 * Manages tree state and provides drag-and-drop functionality
 */
export const TreeView: FC<TreeViewProps> = ({ rootNode: initialRoot, onChange }) => {
  // Tree state
  const [rootNode, setRootNode] = useState<TreeNode>(initialRoot)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  /**
   * Update root node and notify parent of changes
   */
  const updateRoot = useCallback(
    (newRoot: TreeNode) => {
      setRootNode(newRoot)
      onChange?.(newRoot)
    },
    [onChange]
  )

  /**
   * Update a specific node by ID
   */
  const handleUpdateNode = useCallback(
    (id: string, updates: Partial<TreeNode>) => {
      const newRoot = updateNodeById(rootNode, id, updates)
      updateRoot(newRoot)
    },
    [rootNode, updateRoot]
  )

  /**
   * Add a new child node to a parent
   */
  const handleAddNode = useCallback(
    (parentId: string, name: string) => {
      const newNode = createNode(name)
      const newRoot = addChildNode(rootNode, parentId, newNode)
      updateRoot(newRoot)
    },
    [rootNode, updateRoot]
  )

  /**
   * Delete a node and its entire subtree
   */
  const handleDeleteNode = useCallback(
    (id: string) => {
      const newRoot = deleteNodeById(rootNode, id)
      if (newRoot) {
        updateRoot(newRoot)
      }
    },
    [rootNode, updateRoot]
  )

  /**
   * Handle drag end - reorder nodes within same parent
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (!over || active.id === over.id) {
        return
      }

      // Find the parent of the dragged item
      const findParentOf = (node: TreeNode, targetId: string): TreeNode | null => {
        if (node.children) {
          for (const child of node.children) {
            if (child.id === targetId) {
              return node
            }
            const found = findParentOf(child, targetId)
            if (found) return found
          }
        }
        return null
      }

      const parent = findParentOf(rootNode, String(active.id))
      if (!parent || !parent.children) return

      const oldIndex = parent.children.findIndex(c => c.id === active.id)
      const newIndex = parent.children.findIndex(c => c.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newRoot = reorderNodes(rootNode, parent.id, oldIndex, newIndex)
        updateRoot(newRoot)
      }
    },
    [rootNode, updateRoot]
  )

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    // eslint-disable-next-line no-console
    console.log('Drag started:', event.active.id)
  }, [])

  // Memoize tree node item props
  const treeItemProps = useMemo(
    () => ({
      onUpdateNode: handleUpdateNode,
      onAddNode: handleAddNode,
      onDeleteNode: handleDeleteNode,
      onMoveNode: (_id: string, _pid: string | null, _idx: number) => {
        // Cross-parent moves not implemented in this version
      },
    }),
    [handleUpdateNode, handleAddNode, handleDeleteNode]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.treeView}>
        <SortableTreeNode
          node={rootNode}
          level={0}
          parentId={null}
          onUpdateNode={treeItemProps.onUpdateNode}
          onAddNode={treeItemProps.onAddNode}
          onDeleteNode={treeItemProps.onDeleteNode}
          onMoveNode={treeItemProps.onMoveNode}
        />
      </div>
    </DndContext>
  )
}
