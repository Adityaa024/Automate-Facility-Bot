import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import apiService from '../services/api';
import AdminStatsPage from './AdminStatsPage';
import ImageModal from '../components/ImageModal';

const AdminDashboardPage = () => {
  const { user, isSuperAdmin, isDepartmentAdmin } = useAuth();
  const { 
    issues, 
    stats, 
    loading, 
    error, 
    loadIssues, 
    updateIssueStatus, 
    deleteIssue,
    updateIssue,
    assignIssue
  } = useIssues();
  
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [assigningIssue, setAssigningIssue] = useState(null);
  const [maintenanceStaff, setMaintenanceStaff] = useState([]);
  const [imageModal, setImageModal] = useState({ isOpen: false, imageSrc: null });

  const loadUsers = useCallback(async () => {
    try {
      const response = await apiService.users.getAll();
      setUsers(response.data.users);
      setUserStats(response.data.stats);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, []);

  const loadMaintenanceStaff = useCallback(async () => {
    try {
      const response = await apiService.users.searchMaintenanceStaff('');
      setMaintenanceStaff(response.data.users);
    } catch (error) {
      console.error('Failed to load maintenance staff:', error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadIssues();
    loadUsers();
    loadMaintenanceStaff();
  }, [loadIssues, loadUsers, loadMaintenanceStaff]);

  // Filter issues based on selected filters
  const filteredIssues = issues.filter(issue => {
    const statusMatch = selectedStatus === 'all' || issue.status === selectedStatus;
    const categoryMatch = selectedCategory === 'all' || issue.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || issue.priority === selectedPriority;
    const departmentMatch = selectedDepartment === 'all' || issue.department === selectedDepartment;
    return statusMatch && categoryMatch && priorityMatch && departmentMatch;
  });

  const statusFilters = [
    { value: 'all', label: 'All Issues', count: issues.length },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'in-progress', label: 'In Progress', count: stats['in-progress'] },
    { value: 'resolved', label: 'Resolved', count: stats.resolved },
    { value: 'cancelled', label: 'Cancelled', count: stats.cancelled }
  ];

     const categoryFilters = [
     { value: 'all', label: 'All Categories' },
     { value: 'electricity', label: 'Electrical & Lighting', icon: '⚡' },
     { value: 'wifi', label: 'Network & Connectivity', icon: '📶' },
     { value: 'water', label: 'Plumbing & Water', icon: '💧' },
     { value: 'cleanliness', label: 'Cleaning & Maintenance', icon: '🧹' },
     { value: 'furniture', label: 'Furniture & Equipment', icon: '🪑' },
     { value: 'heating', label: 'HVAC & Climate', icon: '🌡️' },
     { value: 'security', label: 'Security & Safety', icon: '🔒' },
     { value: 'other', label: 'Other Issues', icon: '🔧' }
   ];

  const priorityFilters = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const departmentFilters = [
    { value: 'all', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science', icon: '💻' },
    { value: 'Engineering', label: 'Engineering', icon: '⚙️' },
    { value: 'Business', label: 'Business', icon: '💼' },
    { value: 'Arts', label: 'Arts', icon: '🎨' },
    { value: 'Administration', label: 'Administration', icon: '🏛️' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in-progress': return '🔄';
      case 'resolved': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

     const getCategoryIcon = (category) => {
     const categoryMap = {
       electricity: '⚡',
       wifi: '📶',
       water: '💧',
       cleanliness: '🧹',
       furniture: '🪑',
       heating: '🌡️',
       security: '🔒',
       other: '🔧'
     };
     return categoryMap[category] || '🔧';
   };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateIssueStatus(issueId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update issue status. Please try again.');
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await deleteIssue(issueId);
      } catch (error) {
        console.error('Failed to delete issue:', error);
        alert('Failed to delete issue. Please try again.');
      }
    }
  };

  const handleEditIssue = async (issueData) => {
    try {
      await updateIssue(editingIssue._id, issueData);
      setEditingIssue(null);
    } catch (error) {
      console.error('Failed to update issue:', error);
      alert('Failed to update issue. Please try again.');
    }
  };

  const handleAssignIssue = async (issueId, assignedTo) => {
    try {
      await assignIssue(issueId, assignedTo);
      setAssigningIssue(null);
    } catch (error) {
      console.error('Failed to assign issue:', error);
      alert('Failed to assign issue. Please try again.');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await apiService.users.toggleStatus(userId);
      loadUsers(); // Reload users after status change
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysSinceCreated = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff === 0) {
      return 'Today';
    } else if (daysDiff === 1) {
      return '1 day ago';
    } else if (daysDiff < 7) {
      return `${daysDiff} days ago`;
    } else if (daysDiff < 30) {
      const weeks = Math.floor(daysDiff / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(daysDiff / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  };

  const getTimeColor = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 1) {
      return 'text-green-600';
    } else if (daysDiff <= 3) {
      return 'text-yellow-600';
    } else if (daysDiff <= 7) {
      return 'text-orange-600';
    } else {
      return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadIssues()}
            className="btn-primary"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
                     <h1 className="text-4xl font-bold text-gray-900 mb-4">
             {isDepartmentAdmin() ? `${user.department} Admin Dashboard` : 'Admin Dashboard'}
           </h1>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             {isDepartmentAdmin() 
               ? `Manage facility issues for ${user.department} department`
               : 'Manage all facility issues, users, and system statistics'
             }
           </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowUserManagement(false);
                setShowStats(false);
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                !showUserManagement && !showStats
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Issue Management
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowUserManagement(true);
                setShowStats(false);
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                showUserManagement
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 User Management
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowUserManagement(false);
                setShowStats(true);
              }}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                showStats
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Statistics
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showUserManagement && !showStats ? (
            // Issue Management Section
            <motion.div
              key="issues"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
              >
                {statusFilters.map((filter, index) => (
                  <motion.div
                    key={filter.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="card p-6 text-center cursor-pointer"
                    onClick={() => setSelectedStatus(filter.value)}
                  >
                    <div className="text-3xl mb-2">{getStatusIcon(filter.value === 'all' ? 'all' : filter.value)}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{filter.count}</div>
                    <div className="text-sm text-gray-600">{filter.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                {/* Status Filters */}
                <div className="flex flex-wrap justify-center gap-2">
                  {statusFilters.map((filter) => (
                    <motion.button
                      key={filter.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedStatus(filter.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedStatus === filter.value
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </motion.button>
                  ))}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-2">
                  {categoryFilters.map((filter) => (
                    <motion.button
                      key={filter.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(filter.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === filter.value
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {filter.icon && <span className="mr-2">{filter.icon}</span>}
                      {filter.label}
                    </motion.button>
                  ))}
                </div>

                                 {/* Priority Filters */}
                 <div className="flex flex-wrap justify-center gap-2">
                   {priorityFilters.map((filter) => (
                     <motion.button
                       key={filter.value}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setSelectedPriority(filter.value)}
                       className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                         selectedPriority === filter.value
                           ? 'bg-primary-600 text-white shadow-lg'
                           : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                       }`}
                     >
                       <span className={filter.color}>{filter.label}</span>
                     </motion.button>
                   ))}
                 </div>

                 {/* Department Filters - Only for Super Admin */}
                 {isSuperAdmin() && (
                   <div className="flex flex-wrap justify-center gap-2">
                     {departmentFilters.map((filter) => (
                       <motion.button
                         key={filter.value}
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => setSelectedDepartment(filter.value)}
                         className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                           selectedDepartment === filter.value
                             ? 'bg-primary-600 text-white shadow-lg'
                             : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                         }`}
                       >
                         {filter.icon && <span className="mr-2">{filter.icon}</span>}
                         {filter.label}
                       </motion.button>
                     ))}
                   </div>
                 )}
              </motion.div>

              {/* Issues Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="wait">
                  {filteredIssues.map((issue, index) => (
                    <motion.div
                      key={issue._id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="card p-6"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getCategoryIcon(issue.category)}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{issue.title}</h3>
                            <p className="text-sm text-gray-500">{issue.location}</p>
                                                         <p className="text-xs text-gray-400">
                               Reported by: {issue.reportedBy.firstName} {issue.reportedBy.lastName}
                             </p>
                             <p className="text-xs text-gray-400">
                               Department: {issue.department}
                             </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                            {getStatusIcon(issue.status)} {issue.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                            {issue.priority} priority
                          </span>
                        </div>
                      </div>

                                             {/* Description */}
                       <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                         {issue.description}
                       </p>

                       {/* Image Display */}
                       {issue.image && (
                         <div className="mb-4">
                           <div className="relative group">
                             <img
                               src={issue.image}
                               alt="Issue"
                               className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                               onClick={() => {
                                 setImageModal({ isOpen: true, imageSrc: issue.image });
                               }}
                             />
                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                               <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                 <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                                   📸 Click to view
                                 </span>
                               </div>
                             </div>
                           </div>
                           <p className="text-xs text-gray-500 mt-1">📸 Image attached</p>
                         </div>
                       )}

                                             {/* Footer */}
                       <div className="flex items-center justify-between text-xs text-gray-500">
                         <div className="flex flex-col">
                           <span>Reported: {formatDate(issue.createdAt)}</span>
                           <span className={`font-medium ${getTimeColor(issue.createdAt)}`}>
                             ⏱️ {getDaysSinceCreated(issue.createdAt)}
                           </span>
                         </div>
                         <span>ID: #{issue._id.slice(-6)}</span>
                       </div>

                       {/* Assignment Info */}
                       {issue.assignedTo && (
                         <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                           <p className="text-xs text-blue-600">
                             <span className="font-medium">Assigned to:</span> {issue.assignedTo.firstName} {issue.assignedTo.lastName}
                           </p>
                         </div>
                       )}

                      {/* Admin Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingIssue(issue)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
                        >
                          Edit
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAssigningIssue(issue)}
                          className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors duration-300"
                        >
                          Assign
                        </motion.button>

                        {issue.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStatusChange(issue._id, 'in-progress')}
                            className="px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-300"
                          >
                            Start
                          </motion.button>
                        )}
                        
                        {issue.status === 'in-progress' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStatusChange(issue._id, 'resolved')}
                            className="px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-300"
                          >
                            Resolve
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteIssue(issue._id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-300"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {filteredIssues.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
                  <p className="text-gray-600">
                    There are no issues matching the selected filters.
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : showUserManagement ? (
            // User Management Section
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* User Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="card p-6 text-center"
                >
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{userStats.user || 0}</div>
                  <div className="text-sm text-gray-600">Regular Users</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="card p-6 text-center"
                >
                  <div className="text-3xl mb-2">👨‍💼</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{userStats.admin || 0}</div>
                  <div className="text-sm text-gray-600">Administrators</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ y: -5 }}
                  className="card p-6 text-center"
                >
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{users.length}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </motion.div>
              </motion.div>

              {/* Users List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {users.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="card p-6"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary-600">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.department}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Role:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {user.studentId && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Student ID:</span>
                          <span className="text-sm font-medium">{user.studentId}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleUserStatus(user._id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                          user.isActive
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {users.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">
                    There are no users in the system.
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Statistics Section
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminStatsPage />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Issue Modal */}
        {editingIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Issue</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleEditIssue({
                  title: formData.get('title'),
                  description: formData.get('description'),
                  location: formData.get('location'),
                  category: formData.get('category'),
                  priority: formData.get('priority')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingIssue.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingIssue.description}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingIssue.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                         <select
                       name="category"
                       defaultValue={editingIssue.category}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                     >
                       <option value="electricity">Electrical & Lighting</option>
                       <option value="wifi">Network & Connectivity</option>
                       <option value="water">Plumbing & Water</option>
                       <option value="cleanliness">Cleaning & Maintenance</option>
                       <option value="furniture">Furniture & Equipment</option>
                       <option value="heating">HVAC & Climate</option>
                       <option value="security">Security & Safety</option>
                       <option value="other">Other Issues</option>
                     </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue={editingIssue.priority}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingIssue(null)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Assign Issue Modal */}
        {assigningIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Assign Issue</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Assign "{assigningIssue.title}" to maintenance staff:
                </p>
                <select
                  id="assignee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select staff member</option>
                  {maintenanceStaff.map(staff => (
                    <option key={staff._id} value={staff._id}>
                      {staff.firstName} {staff.lastName} - {staff.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const assigneeId = document.getElementById('assignee').value;
                    if (assigneeId) {
                      handleAssignIssue(assigningIssue._id, assigneeId);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                >
                  Assign
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAssigningIssue(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
                 )}

         {/* Image Modal */}
         <ImageModal
           isOpen={imageModal.isOpen}
           imageSrc={imageModal.imageSrc}
           onClose={() => setImageModal({ isOpen: false, imageSrc: null })}
         />
       </div>
     </div>
   );
 };

export default AdminDashboardPage;
