import type { FC } from 'react'

import styles from './KanbanBoard.module.css'

export const KanbanBoard: FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Kanban Board</h2>
      <p className={styles.description}>
        Drag and drop kanban board will be implemented here.
      </p>
    </div>
  )
}
