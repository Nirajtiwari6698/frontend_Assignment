import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TreeView } from '@/components/TreeView';
import type { TreeNode } from '@/components/TreeView';
import styles from './App.module.css';

/**
 * Initial tree data for demonstration
 */
const initialTreeData: TreeNode = {
  id: 'root',
  name: 'Root',
  children: [
    {
      id: 'node-1',
      name: 'Level A',
      children: [],
      isExpanded: false,
    },
    {
      id: 'node-2',
      name: 'Level A',
      children: [],
      isExpanded: false,
    },
    {
      id: 'node-3',
      name: 'Level A',
      children: [],
      isExpanded: false,
    },
  ],
  isExpanded: true,
};

/**
 * Navigation bar component
 */
function Navigation(): React.JSX.Element {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <h1 className={styles.navTitle}>Frontend Developer Assignment</h1>
        <div className={styles.navLinks}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
            end
          >
            Tree View
          </NavLink>
          <NavLink
            to="/kanban"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            Kanban Board
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

/**
 * Tree View page component
 */
function TreeViewPage(): React.JSX.Element {
  const handleTreeChange = (rootNode: TreeNode) => {
    // eslint-disable-next-line no-console
    console.log('Tree updated:', rootNode);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.pageTitle}>Tree View Component</h2>
        <div className={styles.treeContainer}>
          <TreeView rootNode={initialTreeData} onChange={handleTreeChange} />
        </div>
      </div>
    </div>
  );
}

/**
 * Kanban Board page component
 */
function KanbanBoardPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <KanbanBoard />
    </div>
  );
}

/**
 * Main application component with routing
 */
export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Navigation />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<TreeViewPage />} />
            <Route path="/kanban" element={<KanbanBoardPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
