import { useState, useCallback } from 'react'
import type { FC } from 'react'
import classNames from 'classnames'

import { routes, defaultRoute } from '@/app/routes'
import type { ViewState } from '@/types'
import '@/styles/global.css'

export const App: FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(defaultRoute!.path as ViewState)

  const handleNavigation = useCallback((path: ViewState) => {
    setActiveView(path)
  }, [])

  const ActiveComponent = routes.find(route => route.path === activeView)?.component ?? defaultRoute!.component

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">Frontend Assignment</div>
        <nav className="app-nav">
          {routes.map(route => (
            <button
              key={route.path}
              className={classNames('nav-link', { active: activeView === route.path })}
              onClick={() => handleNavigation(route.path as ViewState)}
              type="button"
            >
              {route.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <div className="container">
          <ActiveComponent />
        </div>
      </main>
    </div>
  )
}
