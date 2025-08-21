import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import ImageModal from '../components/ImageModal';
import EditIssueModal from '../components/EditIssueModal';

const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const { 
    issues, 
    stats, 
    loading, 
    error, 
    loadIssues, 
    updateIssueStatus, 
    deleteIssue,
    updateIssue
  } = useIssues();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [imageModal, setImageModal] = useState({ isOpen: false, imageSrc: null });
  const [editModal, setEditModal] = useState({ isOpen: false, issue: null });

  // Load issues on component mount
  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // Filter issues based on selected filters
  const filteredIssues = issues.filter(issue => {
    const statusMatch = selectedStatus === 'all' || issue.status === selectedStatus;
    const categoryMatch = selectedCategory === 'all' || issue.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || issue.priority === selectedPriority;
    return statusMatch && categoryMatch && priorityMatch;
  });

  const statusFilters = [
    { value: 'all', label: 'All Issues', count: issues.length },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'in-progress', label: 'In Progress', count: stats['in-progress'] },
    { value: 'resolved', label: 'Resolved', count: stats.resolved }
  ];

  const categoryFilters = [
    { value: 'all', label: 'All Categories' },
    { value: 'electricity', label: 'Electricity', icon: '⚡' },
    { value: 'wifi', label: 'WiFi', icon: '📶' },
    { value: 'water', label: 'Water', icon: '💧' },
    { value: 'cleanliness', label: 'Cleanliness', icon: '🧹' },
    { value: 'furniture', label: 'Furniture', icon: '🪑' },
    { value: 'heating', label: 'Heating', icon: '🔥' },
    { value: 'security', label: 'Security', icon: '🔒' },
    { value: 'other', label: 'Other', icon: '🔧' }
  ];

  const priorityFilters = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
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

  const handleEditIssue = (issue) => {
    setEditModal({ isOpen: true, issue });
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await updateIssue(editModal.issue._id, updatedData);
      setEditModal({ isOpen: false, issue: null });
    } catch (error) {
      console.error('Failed to update issue:', error);
      throw error; // Re-throw to let the modal handle the error
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
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Issues</h2>
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
            {isAdmin() ? 'Admin Dashboard' : 'My Issues'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAdmin() 
              ? 'Manage and track all reported facility issues across the campus'
              : 'Track and manage your reported facility issues'
            }
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {statusFilters.map((filter, index) => (
            <motion.div
              key={filter.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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
          transition={{ duration: 0.8, delay: 0.4 }}
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
        </motion.div>

        {/* Issues Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
                      {isAdmin() && (
                        <p className="text-xs text-gray-400">
                          Reported by: {issue.reportedBy.firstName} {issue.reportedBy.lastName}
                        </p>
                      )}
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

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors duration-300"
                  >
                    View Details
                  </motion.button>
                  
                  {isAdmin() && (
                    <>
                      {/* Admin Actions */}
                      {issue.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(issue._id, 'in-progress')}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-300"
                        >
                          Start Work
                        </motion.button>
                      )}
                      
                      {issue.status === 'in-progress' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(issue._id, 'resolved')}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-300"
                        >
                          Mark Resolved
                        </motion.button>
                      )}
                    </>
                  )}
                  
                  {/* User can edit and delete their own issues */}
                  {!isAdmin() && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditIssue(issue)}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-300"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteIssue(issue._id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-300"
                      >
                        Delete
                      </motion.button>
                    </>
                  )}
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
              {isAdmin() 
                ? 'There are no issues matching the selected filters.'
                : 'You haven\'t reported any issues yet.'
              }
            </p>
          </motion.div>
                 )}

         {/* Image Modal */}
         <ImageModal
           isOpen={imageModal.isOpen}
           imageSrc={imageModal.imageSrc}
           onClose={() => setImageModal({ isOpen: false, imageSrc: null })}
         />

         {/* Edit Issue Modal */}
         <EditIssueModal
           isOpen={editModal.isOpen}
           issue={editModal.issue}
           onClose={() => setEditModal({ isOpen: false, issue: null })}
           onSave={handleSaveEdit}
         />
       </div>
     </div>
   );
 };

export default DashboardPage;
