import type { FC } from 'react'

import styles from './TreeView.module.css'

export const TreeView: FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tree View Component</h2>
      <p className={styles.description}>
        Drag and drop tree structure will be implemented here.
      </p>
    </div>
  )
}
