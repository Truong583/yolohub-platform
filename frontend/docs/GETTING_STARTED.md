# Getting Started Guide

This guide will help you set up, run, and build the YoloHub UI application on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.0.0 or higher)

   - Download from [https://nodejs.org](https://nodejs.org)
   - Check version: `node --version`
   - Recommended: Use Node.js v20.x LTS

2. **npm** (v9.0.0 or higher) or **yarn** or **pnpm**

   - npm comes with Node.js
   - Check version: `npm --version`

3. **Git**
   - Download from [https://git-scm.com](https://git-scm.com)
   - Check version: `git --version`

### Recommended Tools

- **Visual Studio Code** - Code editor with great Next.js support
- **React Developer Tools** - Browser extension for debugging
- **Redux DevTools** - Browser extension for state debugging

---

## Installation

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/yourusername/yolohub-ui.git

# Or using SSH
git clone git@github.com:yourusername/yolohub-ui.git

# Navigate to project directory
cd yolohub-ui
```

### Step 2: Install Dependencies

Choose one of the following package managers:

**Using npm (recommended):**

```bash
npm install
```

**Using yarn:**

```bash
yarn install
```

**Using pnpm:**

```bash
pnpm install
```

This will install all dependencies listed in `package.json`, including:

- Next.js 15.4.4
- React 19.1.0
- TanStack Query
- Shadcn UI components
- Tailwind CSS
- And many more...

### Step 3: Verify Installation

Check if installation was successful:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

---

## Environment Setup

### Step 1: Create Environment File

Copy the example environment file:

```bash
# Windows (PowerShell)
copy .env.local .env

# macOS/Linux
cp .env.local .env
```

### Step 2: Configure Environment Variables

Open `.env.local` and fill in the required values. See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed instructions on how to obtain each value.

**Minimum required variables for development:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8888/api/v1
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your_generated_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:4000
```

### Step 3: Verify Backend API

Ensure your backend API server is running:

```bash
# Check if backend is accessible
curl http://localhost:8888/api/v1/health
# or visit http://localhost:8888/api/v1 in your browser
```

If the backend is not running, refer to the backend repository documentation.

---

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

**What this does:**

- Starts Next.js development server
- Enables Turbopack for faster builds (Next.js's new bundler)
- Runs on port 4000 (configurable)
- Enables hot module replacement (HMR)
- Shows detailed error messages

**Access the application:**

```
http://localhost:4000
```

**Features available in development mode:**

- ✅ Hot reload on file changes
- ✅ Detailed error messages
- ✅ React Developer Tools support
- ✅ Source maps for debugging
- ✅ TanStack Query DevTools

### Development Server Options

**Custom Port:**

```bash
# Run on a different port
npm run dev -- --port 3000
```

**Without Turbopack:**

```bash
# Use webpack instead (if needed)
next dev --port 4000
```

**With Hostname:**

```bash
# Allow external access
npm run dev -- --hostname 0.0.0.0
```

---

## Building for Production

### Step 1: Create Production Build

Build the optimized production bundle:

```bash
npm run build
```

**What this does:**

- Compiles TypeScript to JavaScript
- Optimizes and minifies code
- Generates static pages (SSG)
- Creates production bundles
- Analyzes bundle size
- Checks for build errors

**Output location:** `.next` directory

**Expected output:**

```
Route (app)                                Size     First Load JS
┌ ○ /                                     5.2 kB          120 kB
├ ○ /about                                2.8 kB          118 kB
├ ○ /admin/dashboard                      8.5 kB          135 kB
└ ...
```

### Step 2: Start Production Server

After building, start the production server:

```bash
npm run start
```

**What this does:**

- Starts Next.js in production mode
- Serves optimized static files
- Runs on port 3000 by default
- No hot reload (production environment)

**Access the production build:**

```
http://localhost:3000
```

### Production Build Options

**Custom Port:**

```bash
npm run start -- --port 8080
```

**With Hostname:**

```bash
npm run start -- --hostname 0.0.0.0
```

---

## Available Scripts

Here's a complete list of available npm scripts:

### `npm run dev`

Starts the development server with Turbopack on port 4000.

**Usage:**

```bash
npm run dev
```

**When to use:**

- During active development
- When you need hot reload
- For debugging and testing

---

### `npm run build`

Creates an optimized production build.

**Usage:**

```bash
npm run build
```

**When to use:**

- Before deploying to production
- To check for build errors
- To analyze bundle size
- For performance testing

**Flags:**

```bash
# Analyze bundle size
npm run build -- --experimental-build-reporter
```

---

### `npm run start`

Starts the production server (requires `npm run build` first).

**Usage:**

```bash
npm run start
```

**When to use:**

- To test production build locally
- Before deployment
- To verify SSR/SSG behavior

---

### `npm run lint`

Runs ESLint to check code quality and find issues.

**Usage:**

```bash
npm run lint
```

**Fix issues automatically:**

```bash
npm run lint -- --fix
```

**When to use:**

- Before committing code
- To maintain code quality
- To find potential bugs
- As part of CI/CD pipeline

---

## Project Structure

Understanding the project structure:

```
yolohub-ui/
├── .next/                  # Build output (generated)
├── public/                 # Static assets
│   └── images/            # Image files
├── src/
│   ├── app/               # Next.js 15 App Router
│   │   ├── (protected)/   # Protected routes (requires auth)
│   │   ├── (public)/      # Public routes
│   │   ├── admin/         # Admin dashboard routes
│   │   ├── auth/          # Authentication pages
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── admin/        # Admin-specific components
│   │   ├── auth/         # Auth components
│   │   ├── table/        # Data table components
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── services/         # API service functions
│   ├── stores/           # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions
│   └── validators/       # Form validation schemas (Yup)
├── docs/                 # Documentation files
├── .env.local           # Environment variables (not in git)
├── .env.production     # Environment variables production
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

---

## Development Workflow

### Typical Development Process

1. **Start Backend Server** (if not running)

   ```bash
   # In your backend project directory
   npm run dev
   ```

2. **Start Frontend Development Server**

   ```bash
   # In yolohub-ui directory
   npm run dev
   ```

3. **Make Changes**

   - Edit files in `src/` directory
   - Changes will hot-reload automatically
   - Check browser console for errors

4. **Test Your Changes**

   - Test in browser at `http://localhost:4000`
   - Check responsive design
   - Test API integrations

5. **Lint Your Code**

   ```bash
   npm run lint
   ```

6. **Build for Production**

   ```bash
   npm run build
   ```

7. **Test Production Build**
   ```bash
   npm run start
   ```

### Code Quality Checks

Before committing, always run:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Build to check for errors
npm run build
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: `npm install` fails

**Problem:** Dependency installation errors.

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

#### Issue: Port 4000 is already in use

**Problem:** Another process is using port 4000.

**Solutions:**

**Option 1: Use a different port**

```bash
npm run dev -- --port 3000
```

**Option 2: Kill the process using port 4000**

Windows:

```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

macOS/Linux:

```bash
lsof -ti:4000 | xargs kill -9
```

---

#### Issue: "Error: ECONNREFUSED" when connecting to API

**Problem:** Backend API is not running or URL is incorrect.

**Solutions:**

1. Verify backend server is running on port 8888
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Test API endpoint:
   ```bash
   curl http://localhost:8888/api/v1/health
   ```

---

#### Issue: Environment variables not working

**Problem:** Environment variables are not being read.

**Solutions:**

1. Ensure file is named `.env.local` (not `.env.local.txt`)
2. Restart development server after changing `.env.local`
3. Check for typos in variable names
4. Public variables must start with `NEXT_PUBLIC_`

---

#### Issue: Build fails with TypeScript errors

**Problem:** Type errors preventing build.

**Solutions:**

```bash
# Check TypeScript errors
npx tsc --noEmit

# Review and fix type errors in reported files
```

---

#### Issue: "Module not found" errors

**Problem:** Missing dependencies or incorrect imports.

**Solutions:**

```bash
# Reinstall dependencies
npm install

# Check import paths (use @ alias for src/)
# Example: import { Button } from '@/components/ui/button'
```

---

#### Issue: Slow development server

**Problem:** Development server is slow or unresponsive.

**Solutions:**

1. Turbopack is already enabled (faster than webpack)
2. Clear `.next` cache:
   ```bash
   rm -rf .next
   npm run dev
   ```
3. Check system resources (RAM, CPU)
4. Close unused browser tabs/applications

---

#### Issue: Styling not applied correctly

**Problem:** Tailwind CSS classes not working.

**Solutions:**

1. Check if styles are imported in `app/globals.css`
2. Verify Tailwind config is correct
3. Restart development server
4. Clear browser cache (Ctrl+Shift+Delete)

---

#### Issue: OAuth authentication not working

**Problem:** Google/Facebook login fails.

**Solutions:**

1. Check OAuth credentials in `.env.local`
2. Verify redirect URIs in OAuth provider settings
3. Ensure `NEXTAUTH_URL` matches your app URL
4. Check browser console for specific errors
5. See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for OAuth setup

---

## Performance Optimization Tips

### Development

- Use Turbopack (already enabled)
- Limit number of browser extensions
- Close unnecessary applications
- Use fast SSD for node_modules

### Production

- Always run `npm run build` to test performance
- Use production mode for accurate performance metrics
- Enable compression on your hosting platform
- Use CDN for static assets

---

## Best Practices

### Code Organization

- ✅ Keep components small and focused
- ✅ Use TypeScript for type safety
- ✅ Follow naming conventions (kebab-case for files)
- ✅ Use custom hooks for reusable logic
- ✅ Organize by feature, not by type

### Performance

- ✅ Use React.memo for expensive components
- ✅ Implement proper loading states
- ✅ Use TanStack Query for data fetching
- ✅ Optimize images (use WebP format)
- ✅ Lazy load components when possible

### Security

- ⚠️ Never commit `.env.local`
- ⚠️ Keep dependencies up to date
- ⚠️ Validate user inputs
- ⚠️ Use HTTPS in production
- ⚠️ Implement proper authentication

---

## Next Steps

After successfully running the application:

1. **Read the Documentation**

   - [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
   - [Project Architecture](./ARCHITECTURE.md) (if available)

2. **Explore the Codebase**

   - Start with `src/app/page.tsx` (homepage)
   - Check out components in `src/components/`
   - Review API services in `src/services/`

3. **Join the Team**
   - Follow coding standards
   - Submit pull requests
   - Report issues on GitHub

---

## Additional Resources

### Official Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)

### Learning Resources

- [Next.js Learn Course](https://nextjs.org/learn)
- [React Hook Form](https://react-hook-form.com)
- [Yup Validation](https://github.com/jquense/yup)

### Community

- [Next.js GitHub](https://github.com/vercel/next.js)
- [Next.js Discord](https://discord.gg/nextjs)

---

## Support

If you encounter issues not covered in this guide:

1. Check existing [GitHub Issues](https://github.com/yourusername/yolohub-ui/issues)
2. Search in project documentation
3. Create a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Node version, etc.)

---

**Last Updated:** October 2025

**Version:** 0.1.0
