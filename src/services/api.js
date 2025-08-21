  // Mock API Service for Frontend-Only Demo
class MockApiService {
  constructor() {
    this.baseURL = 'mock://localhost';
    this.mockData = {
      users: [
        {
          _id: '1',
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@university.edu',
          role: 'admin',
          department: 'Administration',
          adminType: 'super', // Super admin can manage all departments
          studentId: null,
          isActive: true
        },
        {
          _id: '2',
          firstName: 'John',
          lastName: 'Student',
          email: 'student@university.edu',
          role: 'user',
          department: 'Computer Science',
          studentId: 'CS001',
          isActive: true
        },
        {
          _id: '3',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@university.edu',
          role: 'user',
          department: 'Engineering',
          studentId: 'ENG002',
          isActive: true
        },
        {
          _id: '4',
          firstName: 'Mike',
          lastName: 'Chen',
          email: 'mike.chen@university.edu',
          role: 'user',
          department: 'Business',
          studentId: 'BUS003',
          isActive: true
        },
        {
          _id: '5',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@university.edu',
          role: 'user',
          department: 'Arts',
          studentId: 'ART004',
          isActive: false
        },
                 {
           _id: '6',
           firstName: 'Dr. Sarah',
           lastName: 'Mitchell',
           email: 'tech.admin@university.edu',
           role: 'admin',
           department: 'Computer Science',
           adminType: 'department', // Department-specific admin
           studentId: null,
           isActive: true
         },
         {
           _id: '7',
           firstName: 'Prof. Michael',
           lastName: 'Rodriguez',
           email: 'eng.admin@university.edu',
           role: 'admin',
           department: 'Engineering',
           adminType: 'department',
           studentId: null,
           isActive: true
         },
         {
           _id: '8',
           firstName: 'Dr. Jennifer',
           lastName: 'Thompson',
           email: 'business.admin@university.edu',
           role: 'admin',
           department: 'Business',
           adminType: 'department',
           studentId: null,
           isActive: true
         },
         {
           _id: '9',
           firstName: 'Prof. David',
           lastName: 'Anderson',
           email: 'arts.admin@university.edu',
           role: 'admin',
           department: 'Arts',
           adminType: 'department',
           studentId: null,
           isActive: true
         }
      ],
      issues: [
        {
          _id: '1',
          title: 'Broken Light Bulb',
          category: 'electricity',
          location: 'Room 101, Science Building',
          description: 'The light bulb in the corner is not working and needs replacement',
          status: 'pending',
          priority: 'medium',
          department: 'Computer Science',
          assignedTo: null,
          image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
          reportedBy: {
            _id: '2',
            firstName: 'John',
            lastName: 'Student',
            email: 'student@university.edu'
          },
          createdAt: new Date('2024-01-15').toISOString()
        },
        {
          _id: '2',
          title: 'WiFi Connection Issues',
          category: 'wifi',
          location: 'Library, Main Campus',
          description: 'WiFi is very slow in the library area, affecting study sessions',
          status: 'in-progress',
          priority: 'high',
          department: 'Computer Science',
                     assignedTo: {
             _id: '6',
             firstName: 'Dr. Sarah',
             lastName: 'Mitchell',
             email: 'tech.admin@university.edu'
           },
          reportedBy: {
            _id: '2',
            firstName: 'John',
            lastName: 'Student',
            email: 'student@university.edu'
          },
          createdAt: new Date('2024-01-14').toISOString()
        },
                 {
           _id: '3',
           title: 'Water Leak in Bathroom',
           category: 'water',
           location: 'Floor 2, Dormitory A',
           description: 'There is a water leak from the ceiling in the bathroom',
           status: 'resolved',
           priority: 'urgent',
           department: 'Engineering',
           assignedTo: {
             _id: '7',
             firstName: 'Prof. Michael',
             lastName: 'Rodriguez',
             email: 'eng.admin@university.edu'
           },
          image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
          reportedBy: {
            _id: '3',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@university.edu'
          },
          createdAt: new Date('2024-01-10').toISOString()
        },
        {
          _id: '4',
          title: 'Dirty Cafeteria Tables',
          category: 'cleanliness',
          location: 'Student Center Cafeteria',
          description: 'Tables are not being cleaned properly after meals',
          status: 'pending',
          priority: 'low',
          department: 'Business',
          assignedTo: null,
          reportedBy: {
            _id: '4',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@university.edu'
          },
          createdAt: new Date('2024-01-16').toISOString()
        },
        {
          _id: '5',
          title: 'Broken Air Conditioning',
          category: 'other',
          location: 'Computer Lab 3',
          description: 'Air conditioning unit is not working, room is very hot',
          status: 'in-progress',
          priority: 'high',
          department: 'Engineering',
                     assignedTo: {
             _id: '7',
             firstName: 'Prof. Michael',
             lastName: 'Rodriguez',
             email: 'eng.admin@university.edu'
           },
          reportedBy: {
            _id: '3',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@university.edu'
          },
          createdAt: new Date('2024-01-12').toISOString()
        }
      ],
      currentUser: null
    };
  }

  // Helper method to simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Authentication endpoints
  auth = {
    // Register new user
    register: async (userData) => {
      await this.delay();
      
      // Check if user already exists
      const existingUser = this.mockData.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        _id: Date.now().toString(),
        ...userData,
        role: 'user',
        isActive: true
      };
      
      this.mockData.users.push(newUser);
      this.mockData.currentUser = newUser;
      
      // Generate mock token
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('token', token);
      
      return {
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: newUser,
          token
        }
      };
    },

    // Login user
    login: async (credentials) => {
      await this.delay();
      
      const user = this.mockData.users.find(u => 
        u.email === credentials.email && u.isActive
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      this.mockData.currentUser = user;
      
      // Generate mock token
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('token', token);
      
      return {
        status: 'success',
        message: 'Login successful',
        data: {
          user,
          token
        }
      };
    },

    // Get current user profile
    getProfile: async () => {
      await this.delay();
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      return {
        status: 'success',
        data: {
          user: this.mockData.currentUser
        }
      };
    },

    // Update user profile
    updateProfile: async (profileData) => {
      await this.delay();
      
      if (!this.mockData.currentUser) {
        throw new Error('Not authenticated');
      }
      
      Object.assign(this.mockData.currentUser, profileData);
      
      return {
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          user: this.mockData.currentUser
        }
      };
    },

    // Change password
    changePassword: async (passwordData) => {
      await this.delay();
      
      return {
        status: 'success',
        message: 'Password changed successfully'
      };
    },

    // Logout user
    logout: async () => {
      await this.delay();
      
      this.mockData.currentUser = null;
      localStorage.removeItem('token');
      
      return {
        status: 'success',
        message: 'Logged out successfully'
      };
    },

    // Create admin user (development only)
    seedAdmin: async () => {
      await this.delay();
      
      const admin = this.mockData.users.find(u => u.role === 'admin');
      if (admin) {
        throw new Error('Admin user already exists');
      }
      
      return {
        status: 'success',
        message: 'Admin user created successfully',
        data: {
          user: admin,
          token: `mock-token-${Date.now()}`
        }
      };
    }
  };

  // Issues endpoints
  issues = {
         // Get all issues
     getAll: async (params = {}) => {
       await this.delay();
       
       let filteredIssues = [...this.mockData.issues];
       
       // Filter by user role and admin type
       if (this.mockData.currentUser?.role === 'admin') {
         // Department admins can only see issues from their department
         if (this.mockData.currentUser?.adminType === 'department') {
           filteredIssues = filteredIssues.filter(issue => 
             issue.department === this.mockData.currentUser.department
           );
         }
         // Super admins can see all issues
       } else {
         // Regular users can only see their own issues
         filteredIssues = filteredIssues.filter(issue => 
           issue.reportedBy._id === this.mockData.currentUser?._id
         );
       }
       
       // Filter by status
       if (params.status && params.status !== 'all') {
         filteredIssues = filteredIssues.filter(issue => issue.status === params.status);
       }
       
       // Filter by category
       if (params.category && params.category !== 'all') {
         filteredIssues = filteredIssues.filter(issue => issue.category === params.category);
       }
       
       // Filter by priority
       if (params.priority && params.priority !== 'all') {
         filteredIssues = filteredIssues.filter(issue => issue.priority === params.priority);
       }
       
       // Filter by department (for super admins)
       if (params.department && params.department !== 'all' && this.mockData.currentUser?.adminType === 'super') {
         filteredIssues = filteredIssues.filter(issue => issue.department === params.department);
       }
       
       // Calculate stats
       const stats = {
         pending: filteredIssues.filter(i => i.status === 'pending').length,
         'in-progress': filteredIssues.filter(i => i.status === 'in-progress').length,
         resolved: filteredIssues.filter(i => i.status === 'resolved').length,
         cancelled: filteredIssues.filter(i => i.status === 'cancelled').length
       };
       
       return {
         status: 'success',
         data: {
           issues: filteredIssues,
           stats
         }
       };
     },

    // Get single issue
    getById: async (id) => {
      await this.delay();
      
      const issue = this.mockData.issues.find(i => i._id === id);
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      return {
        status: 'success',
        data: { issue }
      };
    },

         // Create new issue
     create: async (issueData) => {
       await this.delay();
       
       if (!this.mockData.currentUser) {
         throw new Error('Not authenticated');
       }
       
       // Handle image data if present
       let imageData = null;
       if (issueData.image && issueData.image instanceof File) {
         // Convert file to base64 for mock storage
         const reader = new FileReader();
         imageData = await new Promise((resolve) => {
           reader.onload = (e) => resolve(e.target.result);
           reader.readAsDataURL(issueData.image);
         });
       } else if (issueData.image) {
         imageData = issueData.image; // Already base64 or URL
       }
       
       // Auto-assign to department admin based on user's department
       let assignedTo = null;
       const departmentAdmin = this.mockData.users.find(user => 
         user.role === 'admin' && 
         user.adminType === 'department' && 
         user.department === this.mockData.currentUser.department &&
         user.isActive
       );
       
       if (departmentAdmin) {
         assignedTo = {
           _id: departmentAdmin._id,
           firstName: departmentAdmin.firstName,
           lastName: departmentAdmin.lastName,
           email: departmentAdmin.email
         };
       }
       
       const newIssue = {
         _id: Date.now().toString(),
         ...issueData,
         image: imageData,
         department: this.mockData.currentUser.department,
         assignedTo: assignedTo,
         reportedBy: this.mockData.currentUser,
         status: 'pending',
         createdAt: new Date().toISOString()
       };
       
       this.mockData.issues.push(newIssue);
       
       return {
         status: 'success',
         message: 'Issue created successfully',
         data: { issue: newIssue }
       };
     },

    // Update issue
    update: async (id, issueData) => {
      await this.delay();
      
      const issue = this.mockData.issues.find(i => i._id === id);
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      Object.assign(issue, issueData);
      
      return {
        status: 'success',
        message: 'Issue updated successfully',
        data: { issue }
      };
    },

    // Delete issue
    delete: async (id) => {
      await this.delay();
      
      const index = this.mockData.issues.findIndex(i => i._id === id);
      if (index === -1) {
        throw new Error('Issue not found');
      }
      
      this.mockData.issues.splice(index, 1);
      
      return {
        status: 'success',
        message: 'Issue deleted successfully'
      };
    },

    // Update issue status (Admin only)
    updateStatus: async (id, statusData) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const issue = this.mockData.issues.find(i => i._id === id);
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      issue.status = statusData.status;
      
      return {
        status: 'success',
        message: 'Issue status updated successfully',
        data: { issue }
      };
    },

    // Assign issue (Admin only)
    assign: async (id, assignData) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const issue = this.mockData.issues.find(i => i._id === id);
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      issue.assignedTo = assignData.assignedTo;
      
      return {
        status: 'success',
        message: 'Issue assigned successfully',
        data: { issue }
      };
    },

    // Add comment to issue
    addComment: async (id, commentData) => {
      await this.delay();
      
      const issue = this.mockData.issues.find(i => i._id === id);
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      if (!issue.comments) {
        issue.comments = [];
      }
      
      issue.comments.push({
        user: this.mockData.currentUser,
        content: commentData.content,
        createdAt: new Date().toISOString()
      });
      
      return {
        status: 'success',
        message: 'Comment added successfully',
        data: { issue }
      };
    },

    // Get issue statistics (Admin only)
    getStats: async () => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const stats = {
        total: this.mockData.issues.length,
        pending: this.mockData.issues.filter(i => i.status === 'pending').length,
        inProgress: this.mockData.issues.filter(i => i.status === 'in-progress').length,
        resolved: this.mockData.issues.filter(i => i.status === 'resolved').length,
        urgent: this.mockData.issues.filter(i => i.priority === 'urgent').length
      };
      
      return {
        status: 'success',
        data: {
          overview: stats,
                     categories: [
             { _id: 'electricity', count: this.mockData.issues.filter(i => i.category === 'electricity').length },
             { _id: 'wifi', count: this.mockData.issues.filter(i => i.category === 'wifi').length },
             { _id: 'water', count: this.mockData.issues.filter(i => i.category === 'water').length },
             { _id: 'cleanliness', count: this.mockData.issues.filter(i => i.category === 'cleanliness').length },
             { _id: 'furniture', count: this.mockData.issues.filter(i => i.category === 'furniture').length },
             { _id: 'heating', count: this.mockData.issues.filter(i => i.category === 'heating').length },
             { _id: 'security', count: this.mockData.issues.filter(i => i.category === 'security').length },
             { _id: 'other', count: this.mockData.issues.filter(i => i.category === 'other').length }
           ],
          recentIssues: this.mockData.issues.slice(0, 5)
        }
      };
    }
  };

  // Users endpoints (Admin only)
  users = {
    // Get all users
    getAll: async (params = {}) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      let filteredUsers = [...this.mockData.users];
      
      if (params.role && params.role !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.role === params.role);
      }
      
      const stats = {
        user: filteredUsers.filter(u => u.role === 'user').length,
        admin: filteredUsers.filter(u => u.role === 'admin').length
      };
      
      return {
        status: 'success',
        data: {
          users: filteredUsers,
          stats
        }
      };
    },

    // Get user by ID
    getById: async (id) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const user = this.mockData.users.find(u => u._id === id);
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        status: 'success',
        data: { user }
      };
    },

    // Update user
    update: async (id, userData) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const user = this.mockData.users.find(u => u._id === id);
      if (!user) {
        throw new Error('User not found');
      }
      
      Object.assign(user, userData);
      
      return {
        status: 'success',
        message: 'User updated successfully',
        data: { user }
      };
    },

    // Delete user
    delete: async (id) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const index = this.mockData.users.findIndex(u => u._id === id);
      if (index === -1) {
        throw new Error('User not found');
      }
      
      this.mockData.users.splice(index, 1);
      
      return {
        status: 'success',
        message: 'User deleted successfully'
      };
    },

    // Toggle user status
    toggleStatus: async (id) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const user = this.mockData.users.find(u => u._id === id);
      if (!user) {
        throw new Error('User not found');
      }
      
      user.isActive = !user.isActive;
      
      return {
        status: 'success',
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: { user }
      };
    },

    // Get user statistics
    getStats: async () => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const stats = {
        total: this.mockData.users.length,
        active: this.mockData.users.filter(u => u.isActive).length,
        inactive: this.mockData.users.filter(u => !u.isActive).length
      };
      
      return {
        status: 'success',
        data: {
          overview: stats,
          roles: [
            { _id: 'user', count: this.mockData.users.filter(u => u.role === 'user').length },
            { _id: 'admin', count: this.mockData.users.filter(u => u.role === 'admin').length }
          ],
          departments: [
            { _id: 'Computer Science', count: this.mockData.users.filter(u => u.department === 'Computer Science').length },
            { _id: 'Engineering', count: this.mockData.users.filter(u => u.department === 'Engineering').length },
            { _id: 'Business', count: this.mockData.users.filter(u => u.department === 'Business').length },
            { _id: 'Arts', count: this.mockData.users.filter(u => u.department === 'Arts').length },
            { _id: 'Administration', count: this.mockData.users.filter(u => u.department === 'Administration').length }
          ],
          recentUsers: this.mockData.users.slice(0, 5)
        }
      };
    },

    // Search maintenance staff
    searchMaintenanceStaff: async (search) => {
      await this.delay();
      
      if (this.mockData.currentUser?.role !== 'admin') {
        throw new Error('Admin access required');
      }
      
      const users = this.mockData.users.filter(u => 
        u.role === 'user' && 
        u.isActive && 
        (u.firstName.toLowerCase().includes(search.toLowerCase()) ||
         u.lastName.toLowerCase().includes(search.toLowerCase()) ||
         u.email.toLowerCase().includes(search.toLowerCase()))
      );
      
      return {
        status: 'success',
        data: { users: users.slice(0, 10) }
      };
    }
  };

  // Health check
  health = async () => {
    await this.delay();
    
    return {
      status: 'success',
      message: 'Mock API is running',
      timestamp: new Date().toISOString()
    };
  }
}

// Create and export a singleton instance
const apiService = new MockApiService();
export default apiService;
