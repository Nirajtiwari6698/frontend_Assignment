import type { RouteConfig } from '@/types'
import { TreeView } from '@/components/TreeView'
import { KanbanBoard } from '@/components/KanbanBoard'

export const routes: readonly RouteConfig[] = [
  {
    path: 'tree',
    label: 'Tree View',
    component: TreeView,
  },
  {
    path: 'kanban',
    label: 'Kanban Board',
    component: KanbanBoard,
  },
] as const

export const defaultRoute = routes[0]
