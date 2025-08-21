import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin, isSuperAdmin, isDepartmentAdmin } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report Issue' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard' },
    { path: '/report', label: 'Report Issue' },
    { path: '/dashboard', label: 'User Dashboard' }
  ];

  const currentNavItems = isAdmin() ? adminNavItems : navItems;
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 ${
        isAdmin() ? 'bg-purple-50/80' : 'bg-white/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isAdmin() 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                : 'bg-gradient-to-r from-primary-500 to-primary-600'
            }`}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {isAdmin() ? 'SmartReport Admin' : 'SmartReport'}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => (
              <motion.div key={item.path} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? isAdmin()
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* User Info & Auth */}
            <div className="flex items-center space-x-4 ml-8">
              {isAuthenticated() ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isAdmin() 
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                          : 'bg-gradient-to-r from-primary-500 to-primary-600'
                      }`}>
                        <span className="text-white text-sm font-medium">
                          {isAdmin() ? 'A' : 'S'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className={`text-xs ${isAdmin() ? 'text-purple-600' : 'text-gray-500'}`}>
                          {isSuperAdmin() ? 'Super Admin' : isDepartmentAdmin() ? `${user?.department} Admin` : isAdmin() ? 'Administrator' : 'Student'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Badge */}
                  {isAdmin() && (
                    <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {isSuperAdmin() ? '👑 Super Admin' : isDepartmentAdmin() ? `👑 ${user?.department} Admin` : '👑 Admin'}
                    </div>
                  )}

                  {/* Logout Button */}
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-300"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-300"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/admin/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300"
                    >
                      Admin Login
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? isAdmin()
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile User Info & Auth */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                {isAuthenticated() ? (
                  <>
                    {/* User Info */}
                    <div className="px-3 py-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isAdmin() 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                            : 'bg-gradient-to-r from-primary-500 to-primary-600'
                        }`}>
                          <span className="text-white text-sm font-medium">
                            {isAdmin() ? 'A' : 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className={`text-xs ${isAdmin() ? 'text-purple-600' : 'text-gray-500'}`}>
                            {isAdmin() ? 'Administrator' : 'Student'}
                          </p>
                        </div>
                      </div>
                      {isAdmin() && (
                        <div className="mt-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium inline-block">
                          👑 Admin
                        </div>
                      )}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300"
                    >
                      Admin Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 mt-2"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

