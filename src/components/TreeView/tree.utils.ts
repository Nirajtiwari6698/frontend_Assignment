import { v4 as uuidv4 } from 'uuid'
import type { TreeNode } from './types'

/**
 * Find a node by ID in the tree structure (depth-first search)
 * @param root - Root node to start search from
 * @param id - Target node ID
 * @returns The found node or undefined if not found
 */
export const findNodeById = (root: TreeNode, id: string): TreeNode | undefined => {
  if (root.id === id) {
    return root
  }

  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, id)
      if (found) {
        return found
      }
    }
  }

  return undefined
}

/**
 * Find parent node of a given node ID
 * @param root - Root node to start search from
 * @param childId - ID of child node to find parent for
 * @returns The parent node or undefined if not found (or if root is the parent)
 */
export const findParentNode = (root: TreeNode, childId: string): TreeNode | undefined => {
  if (!root.children) {
    return undefined
  }

  for (const child of root.children) {
    if (child.id === childId) {
      return root
    }

    const found = findParentNode(child, childId)
    if (found) {
      return found
    }
  }

  return undefined
}

/**
 * Update a node by ID with partial updates (immutable)
 * @param node - Current node
 * @param targetId - ID of node to update
 * @param updates - Partial updates to apply
 * @returns New tree with updated node
 */
export const updateNodeById = (
  node: TreeNode,
  targetId: string,
  updates: Partial<TreeNode>
): TreeNode => {
  if (node.id === targetId) {
    return { ...node, ...updates }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => updateNodeById(child, targetId, updates)),
    }
  }

  return node
}

/**
 * Add a child node to a parent node (immutable)
 * @param node - Current node
 * @param parentId - ID of parent to add child to
 * @param newNode - New child node to add
 * @returns New tree with added child
 */
export const addChildNode = (node: TreeNode, parentId: string, newNode: TreeNode): TreeNode => {
  if (node.id === parentId) {
    return {
      ...node,
      children: [...(node.children ?? []), newNode],
      isExpanded: true,
    }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => addChildNode(child, parentId, newNode)),
    }
  }

  return node
}

/**
 * Delete a node by ID (immutable) - removes entire subtree
 * @param node - Current node
 * @param targetId - ID of node to delete
 * @returns New tree with node removed, or null if root was deleted
 */
export const deleteNodeById = (node: TreeNode, targetId: string): TreeNode | null => {
  if (node.id === targetId) {
    return null
  }

  if (node.children) {
    const filteredChildren = node.children
      .map(child => deleteNodeById(child, targetId))
      .filter((child): child is TreeNode => child !== null)

    return {
      ...node,
      children: filteredChildren,
    }
  }

  return node
}

/**
 * Check if a node is a descendant of another node
 * Used to prevent invalid drag & drop operations
 * @param potentialAncestor - Potential ancestor node
 * @param potentialDescendantId - ID to check if it's a descendant
 * @returns True if potentialDescendantId is a descendant of potentialAncestor
 */
export const isDescendant = (potentialAncestor: TreeNode, potentialDescendantId: string): boolean => {
  if (!potentialAncestor.children || potentialAncestor.children.length === 0) {
    return false
  }

  for (const child of potentialAncestor.children) {
    if (child.id === potentialDescendantId) {
      return true
    }
    if (isDescendant(child, potentialDescendantId)) {
      return true
    }
  }

  return false
}

/**
 * Move a node to a new parent and position (immutable)
 * @param root - Root node
 * @param draggedId - ID of node being moved
 * @param targetParentId - ID of new parent (null for root level)
 * @param targetIndex - Position in the new parent's children array
 * @returns New tree with node moved
 */
export const moveNode = (
  root: TreeNode,
  draggedId: string,
  targetParentId: string | null,
  targetIndex: number
): TreeNode => {
  // First, find and remove the dragged node from its current location
  const draggedNode = findNodeById(root, draggedId)
  if (!draggedNode) {
    return root
  }

  // Remove node from current position
  let newRoot = deleteNodeById(root, draggedId)
  if (!newRoot) {
    return root // Can't delete root
  }

  // If moving to root level (targetParentId is null), we need special handling
  // For now, we'll only support moving within the same subtree
  if (targetParentId === null) {
    return root // Root level moves not supported in this simplified version
  }

  // Add to new parent at specified index
  newRoot = insertNodeAtIndex(newRoot, targetParentId, draggedNode, targetIndex)

  return newRoot
}

/**
 * Insert a node at a specific index in a parent's children (immutable)
 * @param node - Current node
 * @param parentId - ID of parent to insert into
 * @param newNode - Node to insert
 * @param index - Position to insert at
 * @returns New tree with node inserted
 */
const insertNodeAtIndex = (
  node: TreeNode,
  parentId: string,
  newNode: TreeNode,
  index: number
): TreeNode => {
  if (node.id === parentId) {
    const currentChildren = node.children ?? []
    const newChildren = [...currentChildren]
    newChildren.splice(index, 0, newNode)

    return {
      ...node,
      children: newChildren,
    }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child =>
        insertNodeAtIndex(child, parentId, newNode, index)
      ),
    }
  }

  return node
}

/**
 * Create a new empty node with generated ID
 * @param name - Node name
 * @returns New TreeNode
 */
export const createNode = (name: string): TreeNode => ({
  id: uuidv4(),
  name,
  children: [],
  isExpanded: false,
})

/**
 * Generate mock children for lazy loading simulation
 * @param parentId - ID of parent node
 * @returns Array of mock child nodes
 */
export const generateMockChildren = (parentId: string): TreeNode[] => {
  const count = Math.floor(Math.random() * 3) + 2 // 2-4 children
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `Child ${i + 1} of ${parentId.slice(0, 4)}`,
    children: [],
    isExpanded: false,
  }))
}

/**
 * Reorder children within a parent node (immutable)
 * Used for drag & drop sorting within the same parent
 * @param node - Current node
 * @param parentId - ID of parent whose children to reorder
 * @param fromIndex - Original index of dragged item
 * @param toIndex - New index for dragged item
 * @returns New tree with reordered children
 */
export const reorderNodes = (
  node: TreeNode,
  parentId: string,
  fromIndex: number,
  toIndex: number
): TreeNode => {
  if (node.id === parentId) {
    const children = node.children ?? []
    if (fromIndex < 0 || fromIndex >= children.length || toIndex < 0 || toIndex >= children.length) {
      return node
    }

    const newChildren = [...children]
    const [moved] = newChildren.splice(fromIndex, 1)
    if (moved) {
      newChildren.splice(toIndex, 0, moved)
    }

    return {
      ...node,
      children: newChildren,
    }
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => reorderNodes(child, parentId, fromIndex, toIndex)),
    }
  }

  return node
}
