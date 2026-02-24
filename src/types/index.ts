/**
 * Navigation route configuration
 */
export interface RouteConfig {
  readonly path: string
  readonly label: string
  readonly component: React.ComponentType
}

/**
 * View state for navigation
 */
export type ViewState = 'tree' | 'kanban'
