import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EditIssueModal = ({ isOpen, issue, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    priority: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Categories with icons and descriptions
  const categories = [
    { value: 'electricity', label: 'Electricity', icon: '⚡', description: 'Power issues, electrical equipment, lighting problems' },
    { value: 'wifi', label: 'WiFi', icon: '📶', description: 'Internet connectivity, network issues, signal problems' },
    { value: 'water', label: 'Water', icon: '💧', description: 'Plumbing issues, water supply, drainage problems' },
    { value: 'cleanliness', label: 'Cleanliness', icon: '🧹', description: 'Sanitation, maintenance, hygiene concerns' },
    { value: 'furniture', label: 'Furniture', icon: '🪑', description: 'Chairs, tables, desks, storage units' },
    { value: 'heating', label: 'Heating', icon: '🔥', description: 'HVAC systems, temperature control, ventilation' },
    { value: 'security', label: 'Security', icon: '🔒', description: 'Access control, safety equipment, security systems' },
    { value: 'other', label: 'Other', icon: '🔧', description: 'Miscellaneous issues not covered by other categories' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600', description: 'Minor issues that don\'t affect daily operations' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', description: 'Issues that affect some functionality' },
    { value: 'high', label: 'High', color: 'text-orange-600', description: 'Issues that significantly impact operations' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', description: 'Critical issues requiring immediate attention' }
  ];

  // Initialize form data when issue changes
  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || '',
        description: issue.description || '',
        location: issue.location || '',
        category: issue.category || '',
        priority: issue.priority || '',
        image: null
      });
      setImagePreview(issue.image || null);
      setErrors({});
    }
  }, [issue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update issue:', error);
      setErrors({ submit: 'Failed to update issue. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Issue</h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-2">Update your issue details below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of the issue"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Detailed description of the issue..."
                disabled={loading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Room 101, Science Building"
                disabled={loading}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                {formData.category && (
                  <p className="text-gray-500 text-sm mt-1">
                    {categories.find(c => c.value === formData.category)?.description}
                  </p>
                )}
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                    errors.priority ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select priority</option>
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
                {formData.priority && (
                  <p className="text-gray-500 text-sm mt-1">
                    {priorities.find(p => p.value === formData.priority)?.description}
                  </p>
                )}
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Image
              </label>
              <div className="space-y-4">
                {/* Current Image */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Issue"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={loading}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="text-4xl">📸</div>
                    <div className="text-gray-600">
                      <span className="font-medium text-primary-600 hover:text-primary-500">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </div>
                    <div className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </div>
                  </label>
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={handleClose}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Issue'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditIssueModal;
