# 🏢 Smart Facility Issue Reporting System

A full-stack web application for managing and reporting facility issues in educational institutions. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login**: Secure authentication with JWT tokens
- **Role-Based Access Control**: Different permissions for students and administrators
- **Password Security**: Bcrypt hashing with strength validation
- **Session Management**: Persistent login with token validation

### 📝 Issue Management
- **Issue Reporting**: Students can report facility issues with categories, priorities, and descriptions
- **Real-time Updates**: Live status tracking and updates
- **File Upload**: Support for image attachments
- **Comments System**: Communication between users and administrators
- **Priority Levels**: Low, Medium, High, and Urgent priority classification

### 👨‍💼 Admin Dashboard
- **Issue Overview**: Complete view of all reported issues
- **Status Management**: Update issue status (Pending → In Progress → Resolved)
- **User Management**: View and manage user accounts
- **Statistics**: Real-time analytics and reporting
- **Assignment System**: Assign issues to maintenance staff

### 🎨 User Experience
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging interactions
- **Mobile-First**: Fully responsive across all devices
- **Real-time Feedback**: Success messages and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **React Router**: Client-side routing
- **Context API**: State management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcryptjs**: Password hashing
- **Express Validator**: Input validation

### Development Tools
- **ESLint**: Code linting
- **Nodemon**: Development server with auto-restart
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd facility-issue-reporting
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   
   Create `server/config.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/facility-issue-reporting
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

6. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start Frontend Development Server**
   ```bash
   # In a new terminal
   npm start
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Issues
- `GET /api/issues` - Get all issues (filtered by user role)
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `POST /api/issues/:id/status` - Update issue status (Admin)
- `POST /api/issues/:id/assign` - Assign issue (Admin)
- `POST /api/issues/:id/comments` - Add comment
- `GET /api/issues/stats/overview` - Get issue statistics (Admin)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/toggle-status` - Toggle user status
- `GET /api/users/stats/overview` - Get user statistics

## 👥 User Roles

### Student
- Register and login
- Report facility issues
- View their own issues
- Add comments to their issues
- Delete their own issues
- Track issue status

### Administrator
- All student permissions
- View all issues from all users
- Update issue status
- Assign issues to maintenance staff
- Manage user accounts
- View system statistics
- Access admin dashboard

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user', 'admin'),
  studentId: String (unique, required for students),
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  profileImage: String
}
```

### Issue Model
```javascript
{
  title: String,
  category: String (enum: 'electricity', 'wifi', 'water', 'cleanliness', 'other'),
  location: String,
  description: String,
  status: String (enum: 'pending', 'in-progress', 'resolved', 'cancelled'),
  priority: String (enum: 'low', 'medium', 'high', 'urgent'),
  reportedBy: ObjectId (ref: 'User'),
  assignedTo: ObjectId (ref: 'User'),
  images: Array,
  comments: Array,
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,
  tags: Array,
  isUrgent: Boolean,
  isPublic: Boolean
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (`server/config.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/facility-issue-reporting
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

#### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `facility-issue-reporting`
3. Update the `MONGODB_URI` in your environment variables

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
1. Build the production version
2. Deploy to Netlify or Vercel
3. Set environment variables

```bash
npm run build
# Deploy the build folder
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
npm test
```

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet Security**: Security headers middleware
- **Role-Based Access**: Route protection based on user roles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Integration with maintenance management systems
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced search and filtering
- [ ] Bulk operations for admins

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- MongoDB team for the flexible database
- Express.js community for the robust backend framework

---

**Built with ❤️ for better facility management**
