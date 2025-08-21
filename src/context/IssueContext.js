import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

const IssueContext = createContext();

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

export const IssueProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    'in-progress': 0,
    resolved: 0,
    cancelled: 0
  });

  const loadIssues = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.issues.getAll(params);
      
      setIssues(response.data.issues);
      setStats(response.data.stats);
      
      return response.data;
    } catch (error) {
      console.error('Failed to load issues:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load issues when user changes or component mounts
  useEffect(() => {
    if (isAuthenticated()) {
      loadIssues();
    } else {
      setIssues([]);
      setStats({
        pending: 0,
        'in-progress': 0,
        resolved: 0,
        cancelled: 0
      });
    }
  }, [user, isAuthenticated, loadIssues]); // eslint-disable-line react-hooks/exhaustive-deps

  const addIssue = async (issueData) => {
    try {
      setError(null);
      
      const response = await apiService.issues.create(issueData);
      
      // Add new issue to the beginning of the list
      setIssues(prevIssues => [response.data.issue, ...prevIssues]);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        pending: prevStats.pending + 1
      }));
      
      return response.data.issue;
    } catch (error) {
      console.error('Failed to create issue:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateIssue = async (issueId, issueData) => {
    try {
      setError(null);
      
      const response = await apiService.issues.update(issueId, issueData);
      
      // Update issue in the list
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? response.data.issue : issue
        )
      );
      
      return response.data.issue;
    } catch (error) {
      console.error('Failed to update issue:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteIssue = async (issueId) => {
    try {
      setError(null);
      
      await apiService.issues.delete(issueId);
      
      // Remove issue from the list
      setIssues(prevIssues => prevIssues.filter(issue => issue._id !== issueId));
      
      // Reload stats
      await loadIssues();
      
    } catch (error) {
      console.error('Failed to delete issue:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateIssueStatus = async (issueId, newStatus, comment = '') => {
    try {
      setError(null);
      
      const response = await apiService.issues.updateStatus(issueId, {
        status: newStatus,
        comment
      });
      
      // Update issue in the list
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? response.data.issue : issue
        )
      );
      
      // Reload stats to get updated counts
      await loadIssues();
      
      return response.data.issue;
    } catch (error) {
      console.error('Failed to update issue status:', error);
      setError(error.message);
      throw error;
    }
  };

  const assignIssue = async (issueId, assignedTo, comment = '') => {
    try {
      setError(null);
      
      const response = await apiService.issues.assign(issueId, {
        assignedTo,
        comment
      });
      
      // Update issue in the list
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? response.data.issue : issue
        )
      );
      
      return response.data.issue;
    } catch (error) {
      console.error('Failed to assign issue:', error);
      setError(error.message);
      throw error;
    }
  };

  const addComment = async (issueId, content) => {
    try {
      setError(null);
      
      const response = await apiService.issues.addComment(issueId, { content });
      
      // Update issue in the list
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? response.data.issue : issue
        )
      );
      
      return response.data.issue;
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError(error.message);
      throw error;
    }
  };

  const getIssueById = async (issueId) => {
    try {
      setError(null);
      
      const response = await apiService.issues.getById(issueId);
      
      return response.data.issue;
    } catch (error) {
      console.error('Failed to get issue:', error);
      setError(error.message);
      throw error;
    }
  };

  const getStats = async () => {
    try {
      setError(null);
      
      const response = await apiService.issues.getStats();
      
      return response.data;
    } catch (error) {
      console.error('Failed to get stats:', error);
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const getUserIssues = (userId) => {
    return issues.filter(issue => issue.reportedBy._id === userId);
  };

  const getAllIssues = () => {
    return issues;
  };

  const getIssuesByStatus = (status) => {
    return issues.filter(issue => issue.status === status);
  };

  const getIssuesByCategory = (category) => {
    return issues.filter(issue => issue.category === category);
  };

  const value = {
    issues,
    stats,
    loading,
    error,
    loadIssues,
    addIssue,
    updateIssue,
    deleteIssue,
    updateIssueStatus,
    assignIssue,
    addComment,
    getIssueById,
    getStats,
    getUserIssues,
    getAllIssues,
    getIssuesByStatus,
    getIssuesByCategory,
    clearError
  };

  return (
    <IssueContext.Provider value={value}>
      {children}
    </IssueContext.Provider>
  );
};
