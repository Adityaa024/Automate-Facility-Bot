# Admin Guide - University Facility Management System

## Overview
This guide provides comprehensive information for administrators managing the University Facility Management System. The system supports both Super Admin and Department Admin roles with different levels of access and responsibilities.

## Admin Types

### Super Admin
- **Access**: Full system access across all departments
- **Responsibilities**: 
  - Manage all issues across all departments
  - View and export comprehensive system statistics
  - Manage all users and admins
  - Access to all features and reports
- **Login Credentials**: 
  - Email: `admin@university.edu`
  - Password: `admin123`

### Department Admin
- **Access**: Limited to their assigned department
- **Responsibilities**:
  - Manage issues within their department only
  - View department-specific statistics
  - Manage users within their department
  - Export department-specific reports
- **Example Department Admins**:
  - **Computer Science**: Dr. Sarah Mitchell (`tech.admin@university.edu`)
  - **Engineering**: Prof. Michael Rodriguez (`eng.admin@university.edu`)
  - **Business**: Dr. Jennifer Thompson (`business.admin@university.edu`)
  - **Arts**: Prof. David Anderson (`arts.admin@university.edu`)
  - **Password**: `admin123` (for all department admins)

## Key Features

### 1. Issue Management
- **View Issues**: See all issues (Super Admin) or department-specific issues (Department Admin)
- **Edit Issues**: Modify issue details, status, priority, and category
- **Delete Issues**: Remove issues from the system
- **Status Updates**: Change issue status (pending → in-progress → resolved)
- **Image Support**: View images uploaded with issues in full-screen modal
- **Comments**: Add and view comments on issues

### 2. User Management
- **View Users**: See all users (Super Admin) or department users (Department Admin)
- **Edit Users**: Modify user information and status
- **Delete Users**: Remove users from the system
- **Toggle Status**: Activate/deactivate user accounts

### 3. Statistics and Analytics
- **Overview Dashboard**: Key metrics and statistics
- **Category Breakdown**: Issues by category with visual charts
- **Status Distribution**: Issues by status (pending, in-progress, resolved)
- **Department Analytics**: User and issue distribution by department
- **Recent Activity**: Latest issues and user registrations

### 4. Export Functionality
The system provides comprehensive export capabilities for data analysis and record keeping:

#### Available Export Types:
- **CSV Export**: Compatible with Excel, Google Sheets, and other spreadsheet applications
- **PDF Export**: HTML format that can be printed to PDF using browser print function
- **JSON Export**: Structured data format for analytics and integration

#### Export Reports:
1. **Issue Reports**:
   - Complete issue data including title, description, category, status, priority
   - Department and assignment information
   - Timestamps and user details
   - Image attachment indicators
   - Comment counts

2. **User Reports**:
   - User profiles and contact information
   - Role and department assignments
   - Account status (active/inactive)
   - Registration dates
   - Admin type information

3. **Analytics Reports**:
   - System-wide statistics and metrics
   - Category and status breakdowns
   - Department distribution
   - Performance indicators
   - Recent activity summaries

#### How to Export:
1. Navigate to the **Statistics** page from the admin dashboard
2. Scroll down to the **Export Reports** section
3. Choose the type of report you want to export
4. Select the format (CSV, PDF, or JSON)
5. Click the export button
6. The file will automatically download to your device

#### Export Tips:
- **CSV Files**: Open in Excel or Google Sheets for further analysis
- **HTML Files**: Use browser's print function (Ctrl+P) to save as PDF
- **JSON Files**: Use for data integration or advanced analytics
- **File Naming**: All exports include the current date for easy organization

### 5. Image Management
- **View Images**: Click on issue images to open in full-screen modal
- **Image Support**: System handles image uploads and displays
- **Image Indicators**: Reports show which issues have attached images

## Issue Categories

The system supports comprehensive categorization for better organization:

### Core Categories:
- **⚡ Electricity**: Power issues, electrical equipment, lighting problems
- **📶 WiFi**: Internet connectivity, network issues, signal problems
- **💧 Water**: Plumbing issues, water supply, drainage problems
- **🧹 Cleanliness**: Sanitation, maintenance, hygiene concerns

### Additional Categories:
- **🪑 Furniture**: Chairs, tables, desks, storage units
- **🔥 Heating**: HVAC systems, temperature control, ventilation
- **🔒 Security**: Access control, safety equipment, security systems
- **🔧 Other**: Miscellaneous issues not covered by other categories

## Department Assignment Logic

### Automatic Assignment:
- Issues are automatically assigned to the department admin based on the reporting user's department
- Super Admin can manage issues from all departments
- Department Admins only see and manage issues from their assigned department

### Manual Assignment:
- Admins can manually reassign issues to different departments
- Assignment changes are tracked in the issue history

## Navigation

### Admin Dashboard
- **Overview**: Quick statistics and recent activity
- **Issues**: Manage and view all issues
- **Users**: Manage user accounts
- **Statistics**: Detailed analytics and export options

### Quick Actions
- **Add Issue**: Create new issues manually
- **Edit Issue**: Modify existing issues
- **Delete Issue**: Remove issues from system
- **Export Data**: Generate reports in various formats

## Best Practices

### Issue Management:
1. **Regular Review**: Check pending issues daily
2. **Status Updates**: Keep issue status current
3. **Priority Setting**: Use appropriate priority levels
4. **Image Documentation**: Encourage users to include images
5. **Comments**: Add detailed comments for tracking

### User Management:
1. **Account Verification**: Verify new user accounts
2. **Status Monitoring**: Monitor active/inactive users
3. **Department Assignment**: Ensure correct department assignments
4. **Role Management**: Assign appropriate roles and permissions

### Data Export:
1. **Regular Backups**: Export data regularly for backup
2. **Format Selection**: Choose appropriate format for intended use
3. **File Organization**: Use date-stamped files for organization
4. **Data Analysis**: Use exported data for trend analysis

## Troubleshooting

### Common Issues:
1. **Export Not Working**: Check browser download settings
2. **Image Not Displaying**: Verify image format and size
3. **Permission Errors**: Ensure proper admin role assignment
4. **Data Not Loading**: Check internet connection and refresh page

### Support:
- For technical issues, contact the system administrator
- Check the user guide for basic troubleshooting
- Review system logs for detailed error information

## Security Notes

### Access Control:
- Admin access is restricted to authorized personnel only
- Session management ensures secure access
- Role-based permissions prevent unauthorized actions

### Data Protection:
- User data is handled according to privacy policies
- Export functionality respects user privacy settings
- Sensitive information is protected in reports

---

*This guide is updated regularly. For the latest information, check the system documentation or contact the system administrator.*
