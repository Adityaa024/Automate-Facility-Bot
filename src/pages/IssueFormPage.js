import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';

const IssueFormPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDepartmentAdmin } = useAuth();
  const { addIssue } = useIssues();
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
    priority: 'medium',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

     const categories = [
     { 
       value: 'electricity', 
       label: 'Electrical & Lighting', 
       icon: '⚡',
       description: 'Power outlets, lights, switches, electrical equipment'
     },
     { 
       value: 'wifi', 
       label: 'Network & Connectivity', 
       icon: '📶',
       description: 'WiFi, internet, network access, computer connectivity'
     },
     { 
       value: 'water', 
       label: 'Plumbing & Water', 
       icon: '💧',
       description: 'Water leaks, faucets, toilets, drainage issues'
     },
     { 
       value: 'cleanliness', 
       label: 'Cleaning & Maintenance', 
       icon: '🧹',
       description: 'General cleaning, waste disposal, facility upkeep'
     },
     { 
       value: 'furniture', 
       label: 'Furniture & Equipment', 
       icon: '🪑',
       description: 'Chairs, tables, desks, classroom equipment'
     },
     { 
       value: 'heating', 
       label: 'HVAC & Climate', 
       icon: '🌡️',
       description: 'Air conditioning, heating, ventilation, temperature'
     },
     { 
       value: 'security', 
       label: 'Security & Safety', 
       icon: '🔒',
       description: 'Locks, security systems, safety equipment, access'
     },
     { 
       value: 'other', 
       label: 'Other Issues', 
       icon: '🔧',
       description: 'Any other facility-related problems'
     }
   ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : value
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      alert('Please login to report an issue');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create issue data
      const issueData = {
        title: `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} Issue - ${formData.location}`,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        priority: formData.priority,
        image: formData.image // Include image in issue data
      };

      // Add issue to API
      await addIssue(issueData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        category: '',
        location: '',
        description: '',
        priority: 'medium',
        image: null
      });
      setImagePreview(null);
      
      // Navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to report facility issues</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Go to Login
          </motion.button>
        </div>
      </div>
    );
  }

  // Show success message
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            Issue Reported Successfully!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            Your facility issue has been reported and is now being reviewed by our maintenance team. 
            {user.department && (
              <span className="block mt-2">
                <strong>Department:</strong> {user.department} - This issue will be automatically assigned to the {user.department} department admin.
              </span>
            )}
            You can track its progress in your dashboard.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-xs text-blue-600 mt-2 space-y-1">
                <li>• Your issue will be reviewed by maintenance staff</li>
                <li>• You'll receive updates on the status</li>
                <li>• The issue will be resolved as soon as possible</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in a few seconds...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
            <p className="text-gray-600">
              {isDepartmentAdmin() 
                ? `Report issues for ${user.department} department`
                : 'Help us maintain a better campus by reporting facility issues'
              }
            </p>
            {user && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  <strong>Reporting as:</strong> {user.firstName} {user.lastName} ({user.role === 'admin' ? 'Administrator' : 'Student'})
                  {user.department && (
                    <span className="block mt-1">
                      <strong>Department:</strong> {user.department}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Issue Category *
              </label>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {categories.map((category) => (
                   <motion.button
                     key={category.value}
                     type="button"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                     className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                       formData.category === category.value
                         ? 'border-primary-500 bg-primary-50 text-primary-700'
                         : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                     }`}
                   >
                     <div className="text-2xl mb-2">{category.icon}</div>
                     <div className="text-sm font-medium">{category.label}</div>
                     <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                   </motion.button>
                 ))}
               </div>
            </motion.div>

            {/* Priority Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Priority Level *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorities.map((priority) => (
                  <motion.button
                    key={priority.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-center ${
                      formData.priority === priority.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-sm font-medium ${priority.color}`}>
                      {priority.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Library Floor 2, Room 205"
                className="input-field"
                required
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please provide a detailed description of the issue..."
                rows={4}
                className="input-field resize-none"
                required
              />
            </motion.div>

            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image (Optional)
              </label>
              
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>📸 Image uploaded: {formData.image?.name}</p>
                    <p>📏 Size: {(formData.image?.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-400 transition-colors duration-300">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleInputChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.category || !formData.location || !formData.description}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Issue Report'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default IssueFormPage;
