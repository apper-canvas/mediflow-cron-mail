import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './components/ApperIcon'
import { routeArray } from './config/routes'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const currentRoute = routeArray.find(route => route.path === location.pathname) || routeArray[0]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 flex items-center justify-between z-50">
        <div className="flex items-center space-x-3">
          <ApperIcon name="Activity" className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-surface-900">MediFlow</h1>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors"
        >
          <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 flex-col z-40">
          {/* Logo */}
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Activity" className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-surface-900">MediFlow</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {routeArray.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-surface-700 hover:bg-surface-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5" />
                    <span>{route.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-surface-200">
            <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-900 truncate">Admin User</p>
                <p className="text-xs text-surface-600 truncate">admin@mediflow.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-surface-200 z-50 flex flex-col"
              >
                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-2">
                    {routeArray.map((route) => (
                      <li key={route.id}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-primary text-white'
                                : 'text-surface-700 hover:bg-surface-100'
                            }`
                          }
                        >
                          <ApperIcon name={route.icon} className="w-5 h-5" />
                          <span>{route.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-surface-200">
                  <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-surface-900 truncate">Admin User</p>
                      <p className="text-xs text-surface-600 truncate">admin@mediflow.com</p>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout