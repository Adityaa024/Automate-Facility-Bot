import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const AdminStatsPage = () => {

  const [stats, setStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [issueStats, userStatsData] = await Promise.all([
        apiService.issues.getStats(),
        apiService.users.getStats()
      ]);
      
      setStats(issueStats.data);
      setUserStats(userStatsData.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Time tracking functions
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

  // Export functions
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Handle strings with commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data, filename, title) => {
    // Create a simple HTML table for PDF export
    const tableRows = data.map(row => {
      const cells = Object.values(row).map(value => `<td>${value}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const headers = Object.keys(data[0]);
    const headerRow = headers.map(header => `<th>${header}</th>`).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead>
              <tr>${headerRow}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="footer">
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportIssueReport = async (format = 'csv') => {
    try {
      setExporting(true);
      const response = await apiService.issues.getAll();
      const issues = response.data.issues;
      
      const issueData = issues.map(issue => ({
        ID: issue._id,
        Title: issue.title,
        Description: issue.description,
        Category: issue.category,
        Status: issue.status,
        Priority: issue.priority,
        Department: issue.department,
        ReportedBy: `${issue.reportedBy.firstName} ${issue.reportedBy.lastName}`,
        AssignedTo: issue.assignedTo ? `${issue.assignedTo.firstName} ${issue.assignedTo.lastName}` : 'Unassigned',
        CreatedAt: new Date(issue.createdAt).toLocaleString(),
        TimeSinceCreated: getDaysSinceCreated(issue.createdAt),
        DaysSinceCreated: Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24)),
        UpdatedAt: issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : 'N/A',
        Comments: issue.comments ? issue.comments.length : 0,
        HasImage: issue.image ? 'Yes' : 'No'
      }));

      if (format === 'csv') {
        exportToCSV(issueData, 'issue_report');
      } else if (format === 'pdf') {
        exportToPDF(issueData, 'issue_report', 'Issue Report');
      }
    } catch (error) {
      console.error('Failed to export issue report:', error);
      alert('Failed to export issue report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportUserReport = async (format = 'csv') => {
    try {
      setExporting(true);
      const response = await apiService.users.getAll();
      const users = response.data.users;
      
      const userData = users.map(user => ({
        ID: user._id,
        FirstName: user.firstName,
        LastName: user.lastName,
        Email: user.email,
        Role: user.role,
        AdminType: user.adminType || 'N/A',
        Department: user.department || 'N/A',
        StudentID: user.studentId || 'N/A',
        Status: user.isActive ? 'Active' : 'Inactive',
        CreatedAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'
      }));

      if (format === 'csv') {
        exportToCSV(userData, 'user_report');
      } else if (format === 'pdf') {
        exportToPDF(userData, 'user_report', 'User Report');
      }
    } catch (error) {
      console.error('Failed to export user report:', error);
      alert('Failed to export user report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportAnalytics = async (format = 'json') => {
    try {
      setExporting(true);
      
      // Get all issues and users for comprehensive analytics
      const [issuesResponse, usersResponse] = await Promise.all([
        apiService.issues.getAll(),
        apiService.users.getAll()
      ]);
      
      const issues = issuesResponse.data.issues;
      const users = usersResponse.data.users;

      // Calculate additional analytics
      const analytics = {
        summary: {
          totalIssues: issues.length,
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          pendingIssues: issues.filter(i => i.status === 'pending').length,
          resolvedIssues: issues.filter(i => i.status === 'resolved').length,
          inProgressIssues: issues.filter(i => i.status === 'in-progress').length,
          exportDate: new Date().toISOString()
        },
        categoryBreakdown: stats.categories || [],
        statusBreakdown: [
          { status: 'pending', count: issues.filter(i => i.status === 'pending').length },
          { status: 'in-progress', count: issues.filter(i => i.status === 'in-progress').length },
          { status: 'resolved', count: issues.filter(i => i.status === 'resolved').length }
        ],
        departmentBreakdown: userStats.departments || [],
        recentActivity: {
          recentIssues: stats.recentIssues || [],
          recentUsers: userStats.recentUsers || []
        },
        performanceMetrics: {
          averageResolutionTime: 'Calculated based on resolved issues',
          issuesWithImages: issues.filter(i => i.image).length,
          issuesWithComments: issues.filter(i => i.comments && i.comments.length > 0).length
        },
        timeMetrics: {
          issuesLast24Hours: issues.filter(issue => {
            const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
            return daysDiff <= 1;
          }).length,
          issuesLast7Days: issues.filter(issue => {
            const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
            return daysDiff <= 7;
          }).length,
          issuesLast30Days: issues.filter(issue => {
            const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
            return daysDiff <= 30;
          }).length,
          averageResolutionDays: issues.filter(issue => issue.status === 'resolved').length > 0 
            ? Math.round(issues.filter(issue => issue.status === 'resolved').reduce((acc, issue) => {
                const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
                return acc + daysDiff;
              }, 0) / issues.filter(issue => issue.status === 'resolved').length)
            : 0
        }
      };

      if (format === 'json') {
        exportToJSON(analytics, 'analytics_report');
      } else if (format === 'pdf') {
        // Convert analytics to a format suitable for PDF export
        const analyticsData = [
          { Metric: 'Total Issues', Value: analytics.summary.totalIssues },
          { Metric: 'Total Users', Value: analytics.summary.totalUsers },
          { Metric: 'Active Users', Value: analytics.summary.activeUsers },
          { Metric: 'Pending Issues', Value: analytics.summary.pendingIssues },
          { Metric: 'Resolved Issues', Value: analytics.summary.resolvedIssues },
          { Metric: 'In Progress Issues', Value: analytics.summary.inProgressIssues },
          { Metric: 'Issues with Images', Value: analytics.performanceMetrics.issuesWithImages },
          { Metric: 'Issues with Comments', Value: analytics.performanceMetrics.issuesWithComments },
          { Metric: 'Issues Last 24 Hours', Value: analytics.timeMetrics.issuesLast24Hours },
          { Metric: 'Issues Last 7 Days', Value: analytics.timeMetrics.issuesLast7Days },
          { Metric: 'Issues Last 30 Days', Value: analytics.timeMetrics.issuesLast30Days },
          { Metric: 'Average Resolution (Days)', Value: analytics.timeMetrics.averageResolutionDays }
        ];
        
        // Add category breakdown
        analytics.categoryBreakdown.forEach(category => {
          analyticsData.push({ 
            Metric: `${category._id} Issues`, 
            Value: category.count 
          });
        });
        
        exportToPDF(analyticsData, 'analytics_report', 'Analytics Report');
      }
    } catch (error) {
      console.error('Failed to export analytics:', error);
      alert('Failed to export analytics. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Statistics</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadStats()}
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
            System Statistics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive analytics and insights about facility issues and user activity
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="card p-6 text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.overview?.total || 0}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="card p-6 text-center"
          >
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.overview?.pending || 0}</div>
            <div className="text-sm text-gray-600">Pending Issues</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
            className="card p-6 text-center"
          >
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.overview?.resolved || 0}</div>
            <div className="text-sm text-gray-600">Resolved Issues</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -5 }}
            className="card p-6 text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{userStats.overview?.total || 0}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </motion.div>
        </motion.div>

        {/* Issue Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Issue Categories Chart */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Issues by Category</h3>
            <div className="space-y-4">
              {stats.categories?.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {category._id === 'electricity' && '⚡'}
                      {category._id === 'wifi' && '📶'}
                      {category._id === 'water' && '💧'}
                      {category._id === 'cleanliness' && '🧹'}
                      {category._id === 'furniture' && '🪑'}
                      {category._id === 'heating' && '🔥'}
                      {category._id === 'security' && '🔒'}
                      {category._id === 'other' && '🔧'}
                    </div>
                    <span className="font-medium text-gray-700 capitalize">
                      {category._id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(category.count / Math.max(...stats.categories.map(c => c.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8 text-right">
                      {category.count}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Statistics */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">User Statistics</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">{userStats.overview?.active || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Inactive Users</span>
                <span className="font-semibold text-red-600">{userStats.overview?.inactive || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Administrators</span>
                <span className="font-semibold text-purple-600">{userStats.roles?.find(r => r._id === 'admin')?.count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Regular Users</span>
                <span className="font-semibold text-blue-600">{userStats.roles?.find(r => r._id === 'user')?.count || 0}</span>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Users by Department</h4>
              <div className="space-y-3">
                {userStats.departments?.map((dept, index) => (
                  <motion.div
                    key={dept._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{dept._id}</span>
                    <span className="text-sm font-medium text-gray-900">{dept.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Issues */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Issues</h3>
            <div className="space-y-4">
              {stats.recentIssues?.slice(0, 5).map((issue, index) => (
                <motion.div
                  key={issue._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg">
                    {issue.category === 'electricity' && '⚡'}
                    {issue.category === 'wifi' && '📶'}
                    {issue.category === 'water' && '💧'}
                    {issue.category === 'cleanliness' && '🧹'}
                    {issue.category === 'furniture' && '🪑'}
                    {issue.category === 'heating' && '🔥'}
                    {issue.category === 'security' && '🔒'}
                    {issue.category === 'other' && '🔧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                    <p className="text-xs text-gray-500">
                      {issue.reportedBy.firstName} {issue.reportedBy.lastName} • {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                    <p className={`text-xs font-medium ${getTimeColor(issue.createdAt)}`}>
                      ⏱️ {getDaysSinceCreated(issue.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Users</h3>
            <div className="space-y-4">
              {userStats.recentUsers?.slice(0, 5).map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="text-sm font-medium">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Time-Based Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12"
        >
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">⏱️ Time-Based Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Recent Issues (Last 24 hours) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="text-3xl mb-2">🕐</div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.recentIssues?.filter(issue => {
                    const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
                    return daysDiff <= 1;
                  }).length || 0}
                </div>
                <div className="text-sm text-green-700">Last 24 Hours</div>
              </motion.div>

              {/* Recent Issues (Last 7 days) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.recentIssues?.filter(issue => {
                    const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
                    return daysDiff <= 7;
                  }).length || 0}
                </div>
                <div className="text-sm text-blue-700">Last 7 Days</div>
              </motion.div>

              {/* Recent Issues (Last 30 days) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.recentIssues?.filter(issue => {
                    const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
                    return daysDiff <= 30;
                  }).length || 0}
                </div>
                <div className="text-sm text-purple-700">Last 30 Days</div>
              </motion.div>

              {/* Average Resolution Time */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stats.recentIssues?.filter(issue => issue.status === 'resolved').length > 0 
                    ? Math.round(stats.recentIssues.filter(issue => issue.status === 'resolved').reduce((acc, issue) => {
                        const daysDiff = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 3600 * 24));
                        return acc + daysDiff;
                      }, 0) / stats.recentIssues.filter(issue => issue.status === 'resolved').length)
                    : 0
                  }
                </div>
                <div className="text-sm text-orange-700">Avg. Resolution (Days)</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="card p-8 bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Export Reports</h3>
            <p className="text-gray-600 mb-6">
              Generate detailed reports for analysis and record keeping
            </p>
            
            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Issue Reports */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Issue Reports</h4>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportIssueReport('csv')}
                    disabled={exporting}
                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                      exporting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    📊 CSV Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportIssueReport('pdf')}
                    disabled={exporting}
                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                      exporting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    📄 PDF Export
                  </motion.button>
                </div>
              </div>

              {/* User Reports */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">User Reports</h4>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportUserReport('csv')}
                    disabled={exporting}
                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                      exporting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    👥 CSV Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportUserReport('pdf')}
                    disabled={exporting}
                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                      exporting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    📄 PDF Export
                  </motion.button>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-3">Analytics</h4>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportAnalytics}
                    disabled={exporting}
                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                      exporting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    📈 JSON Export
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportAnalytics('pdf')}
                    disabled={exporting}
                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                      exporting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    📄 PDF Export
                  </motion.button>
                </div>
              </div>
            </div>

            {exporting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700">Generating report... Please wait.</span>
                </div>
              </motion.div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <p>💡 Tip: CSV files can be opened in Excel or Google Sheets</p>
              <p>📄 HTML files can be printed to PDF using your browser's print function</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminStatsPage;
