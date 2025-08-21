# Department-Based Admin System Guide

## Overview

The SmartReport system now supports department-based administration where each department has its own dedicated admin who can manage issues specific to their department. This provides better organization and faster issue resolution.

## Admin Types

### 1. Super Admin
- **Access**: Can manage all departments and issues
- **Email**: `admin@university.edu`
- **Responsibilities**:
  - View all issues across all departments
  - Manage all users
  - Access comprehensive statistics
  - Filter issues by department
  - Override department assignments

### 2. Department Admin
- **Access**: Can only manage issues from their assigned department
- **Examples**:
  - **Computer Science Admin**: Dr. Sarah Mitchell (`tech.admin@university.edu`)
  - **Engineering Admin**: Prof. Michael Rodriguez (`eng.admin@university.edu`)
  - **Business Admin**: Dr. Jennifer Thompson (`business.admin@university.edu`)
  - **Arts Admin**: Prof. David Anderson (`arts.admin@university.edu`)

## Department Assignment Logic

### Automatic Issue Assignment
When a user reports an issue:
1. **System identifies** the user's department
2. **Automatically assigns** the issue to the corresponding department admin
3. **Department admin** receives the issue in their dashboard
4. **Super admin** can see all issues and override assignments

### Department Mapping
- **Computer Science** → Tech Admin
- **Engineering** → Engineering Admin  
- **Business** → Business Admin
- **Arts** → Arts Admin
- **Administration** → Super Admin

## Login Credentials

### Super Admin
- Email: `admin@university.edu`
- Password: Any password (mock system)
- Access: `/admin/login`

### Department Admins
- **Computer Science**: Dr. Sarah Mitchell (`tech.admin@university.edu`)
- **Engineering**: Prof. Michael Rodriguez (`eng.admin@university.edu`)
- **Business**: Dr. Jennifer Thompson (`business.admin@university.edu`)
- **Arts**: Prof. David Anderson (`arts.admin@university.edu`)
- Password: Any password (mock system)
- Access: `/admin/login`

## Dashboard Features by Admin Type

### Super Admin Dashboard
- **View All Issues**: From all departments
- **Department Filter**: Filter issues by specific department
- **User Management**: Manage all users across departments
- **Statistics**: Comprehensive analytics for all departments
- **Assignment Override**: Can reassign issues between departments

### Department Admin Dashboard
- **Department-Specific Issues**: Only sees issues from their department
- **Department Header**: Shows department name in dashboard title
- **Focused Management**: Streamlined interface for department-specific tasks
- **Department Badge**: Clear identification of admin role

## Issue Workflow

### 1. Issue Reporting
1. User logs in and reports an issue
2. System automatically detects user's department
3. Issue is assigned to the appropriate department admin
4. User receives confirmation with department assignment info

### 2. Issue Management
1. **Department Admin** sees the issue in their dashboard
2. **Admin can**:
   - Update issue status
   - Edit issue details
   - Assign to maintenance staff
   - Add comments
   - View attached images

### 3. Issue Resolution
1. Admin updates status to "in-progress"
2. Admin can assign to specific maintenance staff
3. Admin marks as "resolved" when complete
4. User can track progress in their dashboard

## User Experience

### For Regular Users
- **Automatic Assignment**: Issues automatically go to correct department
- **Clear Communication**: Users see which department is handling their issue
- **Department Context**: Form shows department information
- **Status Tracking**: Can track issue progress

### For Department Admins
- **Focused Dashboard**: Only see relevant department issues
- **Department Identity**: Clear role identification
- **Streamlined Workflow**: Optimized for department-specific management
- **Department Badge**: Visual indicator of admin role

### For Super Admins
- **Complete Overview**: See all issues across departments
- **Department Filtering**: Filter by specific departments
- **Override Capability**: Can reassign issues between departments
- **Comprehensive Management**: Full system access

## Technical Implementation

### Database Structure
- **Users Table**: Includes `adminType` field ('super' or 'department')
- **Issues Table**: Includes `department` and `assignedTo` fields
- **Automatic Assignment**: Logic in issue creation API

### API Endpoints
- **Filtered Issues**: Department admins only see their department's issues
- **User Management**: Super admins can manage all users
- **Statistics**: Department-specific vs. global statistics

### Frontend Features
- **Conditional Rendering**: Different views based on admin type
- **Department Filters**: Super admin can filter by department
- **Role Indicators**: Clear visual identification of admin roles
- **Responsive Design**: Works on all devices

## Benefits

### 1. Improved Organization
- Issues are automatically organized by department
- Admins focus on their specific areas
- Reduced confusion and overlap

### 2. Faster Resolution
- Department admins have specialized knowledge
- Direct assignment reduces routing time
- Clear ownership of issues

### 3. Better Accountability
- Clear responsibility for each department
- Trackable assignment history
- Department-specific performance metrics

### 4. Scalable System
- Easy to add new departments
- Modular admin structure
- Flexible assignment rules

## Testing the System

### Test Scenarios
1. **Login as Super Admin**: See all issues and departments
2. **Login as Department Admin**: See only department-specific issues
3. **Report Issue as User**: Verify automatic department assignment
4. **Filter by Department**: Test super admin filtering
5. **Cross-Department Assignment**: Test super admin override

### Sample Test Data
- **Computer Science Issues**: Network connectivity, computer lab equipment, software issues
- **Engineering Issues**: Lab equipment, workshop machinery, technical facilities
- **Business Issues**: Classroom facilities, presentation equipment, meeting rooms
- **Arts Issues**: Studio equipment, performance spaces, creative facilities

### Issue Categories Available
- **Electrical & Lighting** ⚡: Power outlets, lights, switches, electrical equipment
- **Network & Connectivity** 📶: WiFi, internet, network access, computer connectivity
- **Plumbing & Water** 💧: Water leaks, faucets, toilets, drainage issues
- **Cleaning & Maintenance** 🧹: General cleaning, waste disposal, facility upkeep
- **Furniture & Equipment** 🪑: Chairs, tables, desks, classroom equipment
- **HVAC & Climate** 🌡️: Air conditioning, heating, ventilation, temperature
- **Security & Safety** 🔒: Locks, security systems, safety equipment, access
- **Other Issues** 🔧: Any other facility-related problems

## Future Enhancements

### Planned Features
- **Email Notifications**: Automatic notifications to department admins
- **Department-Specific Categories**: Custom issue categories per department
- **Department Analytics**: Detailed department-specific reports
- **Mobile App**: Department admin mobile interface
- **Integration**: Connect with department-specific systems

### Advanced Features
- **Multi-Department Issues**: Issues affecting multiple departments
- **Escalation Rules**: Automatic escalation to super admin
- **Department Templates**: Custom forms per department
- **Workflow Automation**: Automated status updates and assignments

---

## Quick Reference

### Admin Types
- **Super Admin**: Full system access
- **Department Admin**: Department-specific access

### Key URLs
- Admin Login: `/admin/login`
- Super Admin Dashboard: `/admin/dashboard`
- Department Admin Dashboard: `/admin/dashboard`

### Default Credentials
- Super Admin: `admin@university.edu`
- Department Admins: 
  - Computer Science: `tech.admin@university.edu` (Dr. Sarah Mitchell)
  - Engineering: `eng.admin@university.edu` (Prof. Michael Rodriguez)
  - Business: `business.admin@university.edu` (Dr. Jennifer Thompson)
  - Arts: `arts.admin@university.edu` (Prof. David Anderson)

### Department Mapping
- Computer Science → Dr. Sarah Mitchell (Tech Admin)
- Engineering → Prof. Michael Rodriguez (Engineering Admin)
- Business → Dr. Jennifer Thompson (Business Admin)
- Arts → Prof. David Anderson (Arts Admin)
