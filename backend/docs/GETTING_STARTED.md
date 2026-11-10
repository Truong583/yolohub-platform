# Getting Started with YoloHub LMS API

This comprehensive guide will walk you through setting up, running, and building the YoloHub LMS API project from scratch.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Building for Production](#building-for-production)
- [Database Seeding](#database-seeding)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version  # Should show v18.x.x or higher
     npm --version   # Should show 9.x.x or higher
     ```

2. **MongoDB** (v6 or higher)
   - **Option A**: MongoDB Atlas (Cloud - Recommended)
     - Create free account at [MongoDB Atlas](https://cloud.mongodb.com/)
   - **Option B**: Local Installation
     - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Verify installation:
     ```bash
     mongod --version  # For local installation
     ```

3. **Git** (for version control)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation:
     ```bash
     git --version
     ```

### Optional Tools

- **Postman** or **Insomnia** - For API testing
- **MongoDB Compass** - For database visualization
- **VS Code** - Recommended code editor with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - MongoDB for VS Code

## 📦 Installation

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <your-repository-url>
cd yolohub-api

# Or if you received the source code as a zip file
unzip yolohub-api.zip
cd yolohub-api
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install:

- **Production dependencies**: Express, MongoDB, Stripe, etc.
- **Development dependencies**: TypeScript, ESLint, Nodemon, etc.

**Expected output:**

```
added 250+ packages in 30s
```

### Step 3: Verify Installation

```bash
# Check if all dependencies are installed correctly
npm list --depth=0
```

## ⚙️ Configuration

### Step 1: Create Environment File

```bash
# Copy the development template
cp .env.local .env
```

### Step 2: Configure Environment Variables

Open `.env` file and update the following variables:

#### Minimum Required Configuration

```env
# Server Configuration
NODE_ENV=development
PORT=8888
FRONTEND_URL=http://localhost:4000

# Database (REQUIRED)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/yolohub

# JWT Secrets (REQUIRED - Generate new ones!)
ACCESS_TOKEN_SECRET=your_generated_secret_here
REFRESH_TOKEN_SECRET=your_different_generated_secret_here

# Email Configuration (REQUIRED for user registration)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=youremail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=youremail@gmail.com
EMAIL_FROM_NAME=YoloHub LMS
```

#### Generate Secure Secrets

```bash
# Generate ACCESS_TOKEN_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate REFRESH_TOKEN_SECRET (run again for different value)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Detailed Configuration

For detailed instructions on each environment variable, see:

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)

## 🚀 Running the Project

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

**What happens:**

- ✅ TypeScript files are compiled on-the-fly
- ✅ Server restarts automatically on file changes
- ✅ Runs on `http://localhost:8888` (or your configured PORT)

**Expected output:**

```
[nodemon] starting `ts-node src/index.ts`
🚀 Server is running on port 8888
✅ Connected to MongoDB successfully
```

### Access the API

Once running, you can access:

- **API Base URL**: `http://localhost:8888`
- **Health Check**: `http://localhost:8888/api/health`
- **API Documentation**: Check your routes in `src/routers/`

### Stop the Server

Press `Ctrl + C` in the terminal to stop the development server.

## 🏗️ Building for Production

### Step 1: Build the Project

Compile TypeScript to JavaScript and prepare for production:

```bash
npm run build
```

**What happens:**

1. ✅ Clears the `dist/` directory
2. ✅ Compiles TypeScript files to JavaScript
3. ✅ Resolves path aliases (using tsc-alias)
4. ✅ Creates optimized production build

**Expected output:**

```
Cleaning dist directory...
Compiling TypeScript...
Resolving path aliases...
✅ Build completed successfully!
```

### Step 2: Run Production Build

Start the production server:

```bash
npm start
```

**What happens:**

- ✅ Runs the compiled JavaScript from `dist/` folder
- ✅ No hot-reload (restart required for changes)
- ✅ Optimized for performance

**Expected output:**

```
🚀 Server is running on port 8888
✅ Connected to MongoDB successfully
🔒 Running in production mode
```

### Build Output Structure

```
dist/
├── index.js              # Main entry point
├── configs/              # Configuration files
├── controllers/          # Route controllers
├── models/              # Database models
├── services/            # Business logic
├── middlewares/         # Express middlewares
├── routers/             # API routes
├── utils/               # Utility functions
└── types/               # Type definitions
```

## 🌱 Database Seeding

### Quick Start - Seed Everything

Populate your database with sample data:

```bash
npm run seed:all
```

**What this creates:**

- ✅ 4 System roles (Super Admin, Admin, Student, Guest)
- ✅ 5 Course categories
- ✅ 5 Sample users (4 Students, 1 Guest)
- ✅ 1 Admin user
- ✅ 5 Sample courses

**Default Admin Credentials:**

- **Email**: `admin@yolohub.com`
- **Password**: `Admin@123456`

### Individual Seeding Scripts

Run specific seeders independently:

```bash
# Seed roles first (required for other seeds)
npm run seed:roles

# Seed categories
npm run seed:categories

# Seed sample users
npm run seed:users

# Create admin user
npm run seed:admin

# Seed sample courses
npm run seed:courses

# Reset everything (clears and reseeds)
npm run seed:reset
```

### Seeding Order

If running individually, follow this order:

1. `seed:roles` (creates permission system)
2. `seed:categories` (creates course categories)
3. `seed:users` (requires roles)
4. `seed:admin` (requires roles)
5. `seed:courses` (requires categories and users)

For more details, see: [Database Seeding Guide](../scripts/README.md)

## 🎨 Code Quality

### Linting

Check code for errors and style issues:

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Code Formatting

Format code using Prettier:

```bash
# Check formatting
npm run prettier

# Auto-format all files
npm run prettier:fix
```

### Pre-commit Checklist

Before committing code, run:

```bash
npm run lint:fix && npm run prettier:fix
```

## 📁 Project Structure

```
yolohub-api/
├── src/                          # Source code
│   ├── index.ts                 # Application entry point
│   ├── configs/                 # Configuration files
│   │   ├── permission.ts        # RBAC permissions
│   │   ├── stripe.ts           # Stripe configuration
│   │   ├── gemini.ts           # AI configuration
│   │   └── rate-limit.config.ts # Rate limiting
│   ├── controllers/             # Route controllers
│   │   ├── auth.controller.ts  # Authentication
│   │   ├── course.controller.ts # Course management
│   │   ├── user.controller.ts  # User management
│   │   └── ...
│   ├── models/                  # Mongoose models
│   │   ├── user.ts             # User model
│   │   ├── course.ts           # Course model
│   │   ├── role.ts             # Role model
│   │   └── ...
│   ├── services/                # Business logic
│   │   ├── auth.service.ts     # Auth logic
│   │   ├── course.service.ts   # Course logic
│   │   └── ...
│   ├── routers/                 # API routes
│   │   ├── index.ts            # Main router
│   │   ├── auth.routes.ts      # Auth routes
│   │   ├── course.routes.ts    # Course routes
│   │   └── ...
│   ├── middlewares/             # Express middlewares
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── rbac.middleware.ts  # Permission checking
│   │   └── error.middleware.ts # Error handling
│   ├── schemas/                 # Zod validation schemas
│   │   ├── auth.schema.ts      # Auth validation
│   │   ├── course.schema.ts    # Course validation
│   │   └── ...
│   ├── utils/                   # Utility functions
│   │   ├── auth.ts             # Auth helpers
│   │   ├── email.ts            # Email service
│   │   ├── errors.ts           # Custom errors
│   │   └── ...
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   ├── enums/                   # Enumerations
│   │   └── index.ts
│   └── db/                      # Database connection
│       ├── connection.ts
│       └── index.ts
├── scripts/                     # Database seeding scripts
│   ├── seed-all.ts             # Master seed script
│   ├── seed-roles.ts           # Seed roles
│   ├── seed-users.ts           # Seed users
│   ├── seed-courses.ts         # Seed courses
│   ├── seed-categories.ts      # Seed categories
│   ├── create-admin-user.ts    # Create admin
│   └── README.md               # Seeding documentation
├── docs/                        # Documentation
│   ├── GETTING_STARTED.md      # This file
│   ├── ENVIRONMENT_VARIABLES.md # Env vars guide
│   └── STRIPE_TEST_CARDS.md    # Stripe testing
├── dist/                        # Compiled output (generated)
├── node_modules/                # Dependencies (generated)
├── .env                         # Environment variables (git-ignored)
├── .env.local         # Env template
├── package.json                 # Project configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── nodemon.json                # Nodemon configuration
└── README.md                    # Main documentation
```

## 📜 Available Scripts

| Script              | Command                   | Description                              |
| ------------------- | ------------------------- | ---------------------------------------- |
| **Development**     | `npm run dev`             | Start development server with hot-reload |
| **Build**           | `npm run build`           | Build for production                     |
| **Start**           | `npm start`               | Run production build                     |
| **Lint**            | `npm run lint`            | Check code for errors                    |
| **Lint Fix**        | `npm run lint:fix`        | Auto-fix linting errors                  |
| **Format Check**    | `npm run prettier`        | Check code formatting                    |
| **Format Fix**      | `npm run prettier:fix`    | Auto-format code                         |
| **Seed All**        | `npm run seed:all`        | Seed all sample data                     |
| **Seed Roles**      | `npm run seed:roles`      | Seed system roles                        |
| **Seed Categories** | `npm run seed:categories` | Seed categories                          |
| **Seed Users**      | `npm run seed:users`      | Seed sample users                        |
| **Seed Admin**      | `npm run seed:admin`      | Create admin user                        |
| **Seed Courses**    | `npm run seed:courses`    | Seed sample courses                      |
| **Reset DB**        | `npm run seed:reset`      | Reset and reseed database                |

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::8888
```

**Solutions:**

```bash
# Option A: Kill the process using the port (Windows)
netstat -ano | findstr :8888
taskkill /PID <process_id> /F

# Option B: Kill the process (Mac/Linux)
lsof -ti:8888 | xargs kill -9

# Option C: Change the port in .env
PORT=3000
```

#### 2. MongoDB Connection Failed

**Error:**

```
MongoNetworkError: failed to connect to server
```

**Solutions:**

- ✅ Check `MONGODB_URI` in `.env` file
- ✅ Ensure MongoDB service is running (local)
- ✅ Verify IP whitelist in MongoDB Atlas
- ✅ Check username/password in connection string

#### 3. Module Not Found

**Error:**

```
Error: Cannot find module 'express'
```

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Compilation Errors

**Error:**

```
error TS2307: Cannot find module '~/models'
```

**Solution:**

```bash
# Clean and rebuild
npm run build
```

#### 5. Environment Variables Not Loading

**Error:**

```
undefined environment variables
```

**Solutions:**

- ✅ Ensure `.env` file exists in root directory
- ✅ Check variable names (no typos)
- ✅ Restart the development server
- ✅ Don't use quotes around values in `.env`

### Getting Help

If you encounter issues:

1. **Check Documentation**:
   - [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
   - [Database Seeding Guide](../scripts/README.md)
   - [Stripe Testing Guide](./STRIPE_TEST_CARDS.md)

2. **Verify Prerequisites**:
   - Node.js version (v18+)
   - MongoDB connection
   - All environment variables set

3. **Check Logs**:
   - Look for error messages in terminal
   - Check MongoDB connection status
   - Verify API endpoint responses

## 🚀 Deployment

### Preparing for Production

1. **Update Environment Variables**:

   ```env
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   MONGODB_URI=your_production_mongodb_uri
   ```

2. **Build the Project**:

   ```bash
   npm run build
   ```

3. **Test Production Build Locally**:
   ```bash
   npm start
   ```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configuration file (`vercel.json`) is already included.

#### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create yolohub-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

#### Railway

1. Connect your GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically on push

#### DigitalOcean / AWS / Azure

1. Set up a Node.js server
2. Clone repository
3. Install dependencies: `npm install`
4. Build project: `npm run build`
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name yolohub-api
   pm2 startup
   pm2 save
   ```

### Post-Deployment Checklist

- ✅ Verify all environment variables are set
- ✅ Test API endpoints
- ✅ Check database connection
- ✅ Verify email sending works
- ✅ Test payment integration (Stripe/SePay)
- ✅ Monitor error logs
- ✅ Set up SSL certificate (HTTPS)
- ✅ Configure CORS for frontend domain

## 🎯 Next Steps

After successfully setting up the project:

1. **Explore the API**:
   - Test endpoints using Postman
   - Review API routes in `src/routers/`
   - Check authentication flow

2. **Customize the Project**:
   - Add new features
   - Modify existing models
   - Customize permissions

3. **Connect Frontend**:
   - Update `FRONTEND_URL` in `.env`
   - Configure CORS settings
   - Test API integration

4. **Learn More**:
   - Study the codebase structure
   - Review business logic in services
   - Understand RBAC system

## 📚 Additional Resources

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Database Seeding Guide](../scripts/README.md)
- [Stripe Test Cards](./STRIPE_TEST_CARDS.md)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📝 License

This project is part of the YoloHub LMS system. Please refer to the license agreement provided with your purchase.

---

**🎉 Congratulations!** You're now ready to start developing with YoloHub LMS API!

For questions or support, please refer to the documentation or contact support.
