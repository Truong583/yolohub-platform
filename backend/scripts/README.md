# YoloHub LMS - Database Seeding Scripts

This directory contains comprehensive mock data seeding scripts to help you quickly set up your YoloHub LMS project with realistic sample data.

## 🚀 Quick Start

To seed your database with all sample data, simply run:

```bash
npm run seed:all
```

This will create:

- System roles with proper permissions (Super Admin, Admin, Student, Guest)
- Course categories (5 samples)
- Sample users (5 samples with Student and Guest roles)
- Admin user account
- Sample courses (5 courses without detailed chapters/lessons)

## 📋 Available Scripts

### Individual Seeding Scripts

| Script         | Command                   | Description                                                                            |
| -------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| **Roles**      | `npm run seed:roles`      | Creates system roles (Super Admin, Admin, Student, Guest) with appropriate permissions |
| **Categories** | `npm run seed:categories` | Creates 5 sample course categories (Web Development, Data Science, UI/UX, etc.)        |
| **Users**      | `npm run seed:users`      | Creates 5 sample users (4 Students, 1 Guest) with realistic profiles                   |
| **Admin User** | `npm run seed:admin`      | Creates the main admin user account                                                    |
| **Courses**    | `npm run seed:courses`    | Creates 5 sample courses with basic information (no detailed chapters/lessons)         |

### Master Scripts

| Script             | Command              | Description                                                       |
| ------------------ | -------------------- | ----------------------------------------------------------------- |
| **Seed All**       | `npm run seed:all`   | Runs all seeding scripts in the correct order                     |
| **Reset Database** | `npm run seed:reset` | Alias for `seed:all` - completely resets and reseeds the database |

## 🔧 Prerequisites

Before running the seeding scripts, make sure you have:

1. **Environment Variables**: Ensure your `.env` file is properly configured with:

   ```env
   MONGODB_URI=mongodb://localhost:27017/yolohub-lms
   # or your MongoDB connection string
   ```

2. **Database Connection**: Make sure your MongoDB server is running and accessible

3. **Dependencies**: Install all project dependencies:
   ```bash
   npm install
   ```

## 📊 Sample Data Overview

### Users Created

#### Admin User

- **Email**: `admin@yolohub.com`
- **Password**: `Admin@123456`
- **Role**: Admin (full permissions)

#### Students (4 users)

- **Emails**: `alice.cooper@student.com`, `bob.smith@student.com`, `carol.davis@student.com`, `david.wilson@student.com`
- **Password**: `Student@123`
- **Role**: Student (learning permissions)

#### Guest User (1 user)

- **Email**: `guest@yolohub.com`
- **Password**: `Guest@123`
- **Role**: Guest (limited read-only access)

### Courses Created

1. **Complete React.js Development Bootcamp** (₫2,490,000)
   - Level: Intermediate
   - Category: Web Development
   - Status: Published
   - Basic course information without detailed chapters/lessons

2. **Python for Data Science Masterclass** (₫1,990,000)
   - Level: Beginner
   - Category: Data Science
   - Status: Published
   - Basic course information without detailed chapters/lessons

3. **UI/UX Design Fundamentals** (FREE)
   - Level: Beginner
   - Category: UI/UX Design
   - Status: Published
   - Basic course information without detailed chapters/lessons

4. **Mobile App Development with Flutter** (₫3,190,000)
   - Level: Intermediate
   - Category: Mobile Development
   - Status: Published
   - Basic course information without detailed chapters/lessons

5. **Machine Learning with Python** (₫3,690,000)
   - Level: Advanced
   - Category: Machine Learning
   - Status: Draft
   - Basic course information without detailed chapters/lessons

### Categories Created (5 samples)

- Web Development
- Mobile Development
- Data Science
- Machine Learning
- UI/UX Design

## 🔐 Roles and Permissions

### Super Admin Role

- Ultimate system administrator with all permissions and system access
- Complete control over all system resources
- Role management capabilities

### Admin Role

- System administrator with comprehensive management permissions
- User, course, category, and content management
- Statistics and order management
- Cannot manage roles (security separation)

### Student Role

- Regular student who can enroll in courses and interact with content
- Course enrollment and access
- Review and comment creation
- Blog reading
- Order creation (course purchases)

### Guest Role

- Guest user with limited read-only access to public content
- Public course browsing
- Blog reading
- Review reading

## 🗂️ File Structure

```
scripts/
├── README.md                 # This documentation
├── create-admin-user.ts      # Admin user creation
├── seed-roles.ts            # System roles and permissions
├── seed-categories.ts       # Course categories
├── seed-users.ts           # Sample users with different roles
├── seed-courses.ts         # Comprehensive courses with content
└── seed-all.ts             # Master script to run all seeds
```

## 🔄 Execution Order

When running `npm run seed:all`, the scripts execute in this order:

1. **Roles** - Creates the permission system foundation
2. **Categories** - Sets up course categorization
3. **Users** - Creates sample users (requires roles)
4. **Admin User** - Creates the main admin account (requires roles)
5. **Courses** - Creates courses with content (requires categories and users)

## ⚠️ Important Notes

### Data Cleanup

- Each script clears existing data before creating new records
- The master script (`seed:all`) will completely reset your database
- Always backup important data before running seeding scripts

### Development vs Production

- These scripts are designed for development and testing
- **DO NOT** run seeding scripts in production environments
- The sample data includes test accounts with known passwords

### Customization

- You can modify the sample data in each script to fit your needs
- Add more courses, users, or categories by editing the respective files
- Adjust permissions by modifying the roles configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   ```
   Error: Failed to connect to MongoDB
   ```

   **Solution**: Check your `MONGODB_URI` in `.env` and ensure MongoDB is running

2. **Permission Errors**

   ```
   Error: Role 'Admin' not found
   ```

   **Solution**: Run `npm run seed:roles` first, or use `npm run seed:all`

3. **Duplicate Key Errors**
   ```
   Error: E11000 duplicate key error
   ```
   **Solution**: The script should handle cleanup, but you can manually clear collections if needed

### Getting Help

If you encounter issues:

1. Check that all prerequisites are met
2. Ensure your `.env` file is properly configured
3. Try running individual scripts to isolate the problem
4. Check the console output for specific error messages

## 🎯 Next Steps

After successful seeding:

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Login as Admin**:
   - Email: `admin@yolohub.com`
   - Password: `Admin@123456`

3. **Explore Sample Data**:
   - Browse courses and categories
   - Test user roles and permissions
   - Review the course content structure

4. **Customize for Your Needs**:
   - Modify existing courses
   - Add your own content
   - Adjust user roles and permissions
   - Update branding and styling

## 📝 License

This seeding system is part of the YoloHub LMS project and follows the same licensing terms.
