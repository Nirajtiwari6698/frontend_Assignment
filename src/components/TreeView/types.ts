/**
 * Tree Node data model representing a single node in the tree structure
 */
export interface TreeNode {
  /** Unique identifier for the node */
  id: string
  /** Display name of the node */
  name: string
  /** Child nodes - undefined means not loaded yet (lazy loading) */
  children?: TreeNode[]
  /** Whether the node is currently expanded */
  isExpanded?: boolean
  /** Whether the node is in loading state (for lazy loading) */
  isLoading?: boolean
}

/**
 * Props for the TreeView component
 */
export interface TreeViewProps {
  /** Root node data */
  rootNode: TreeNode
  /** Callback when tree data changes */
  onChange?: (rootNode: TreeNode) => void
}

/**
 * Props for individual TreeNodeItem component
 */
export interface TreeNodeItemProps {
  /** Node data */
  node: TreeNode
  /** Depth level in the tree (0 for root) */
  level: number
  /** Parent node ID (null for root) */
  parentId: string | null
  /** Callback to update a specific node by ID */
  onUpdateNode: (id: string, updates: Partial<TreeNode>) => void
  /** Callback to add a child node */
  onAddNode: (parentId: string, name: string) => void
  /** Callback to delete a node */
  onDeleteNode: (id: string) => void
  /** Callback to move a node (drag & drop) */
  onMoveNode: (draggedId: string, targetParentId: string | null, targetIndex: number) => void
}

/**
 * Props for sortable tree node wrapper
 */
export interface SortableTreeNodeProps extends TreeNodeItemProps {
  /** All sibling node IDs for sortable context */
  siblingIds: string[]
}

/**
 * Editing state for inline editing
 */
export interface EditingState {
  /** ID of node being edited */
  nodeId: string
  /** Current edit value */
  value: string
  /** Edit mode: 'rename' for existing node, 'add' for new child */
  mode: 'rename' | 'add'
}

/**
 * Drag and drop active item data
 */
export interface DragActiveItem {
  /** ID of dragged node */
  id: string
  /** Original parent ID */
  parentId: string | null
}
