# Environment Variables Configuration Guide

This guide explains all environment variables used in the YoloHub LMS project and how to obtain their values for development and production environments.

## 📋 Table of Contents

- [Quick Setup](#quick-setup)
- [Server Configuration](#server-configuration)
- [Authentication & Security](#authentication--security)
- [Database Configuration](#database-configuration)
- [AI Integration](#ai-integration)
- [Payment Gateways](#payment-gateways)
- [Email Configuration](#email-configuration)
- [OAuth Configuration](#oauth-configuration)
- [Environment Files](#environment-files)

## 🚀 Quick Setup

1. Copy the example environment file:

   ```bash
   cp .env-development.txt .env
   ```

2. Update the values according to the sections below

3. Ensure all required services are configured before starting the application

## ⚙️ Server Configuration

### `NODE_ENV`

- **Description**: Defines the application environment
- **Values**: `development` | `production` | `test`
- **Default**: `development`
- **Example**: `NODE_ENV=development`

### `PORT`

- **Description**: Port number for the API server
- **Default**: `8888`
- **Example**: `PORT=8888`
- **Note**: Make sure this port is available and not used by other services

### `FRONTEND_URL`

- **Description**: URL of the frontend application for CORS configuration
- **Development**: `http://localhost:4000`
- **Production**: Your actual frontend domain
- **Example**: `FRONTEND_URL=http://localhost:4000`

## 🔐 Authentication & Security

### `ACCESS_TOKEN_SECRET`

- **Description**: Secret key for signing JWT access tokens
- **How to generate**:

  ```bash
  # Using Node.js
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

  # Using OpenSSL
  openssl rand -hex 64
  ```

- **Example**: `ACCESS_TOKEN_SECRET=a1b2c3d4e5f6...`
- **⚠️ Security**: Use a strong, unique secret for production

### `REFRESH_TOKEN_SECRET`

- **Description**: Secret key for signing JWT refresh tokens
- **How to generate**: Same as access token secret (use different value)
- **Example**: `REFRESH_TOKEN_SECRET=x1y2z3a4b5c6...`
- **⚠️ Security**: Must be different from access token secret

### `ACCESS_TOKEN_EXPIRES_IN`

- **Description**: Expiration time for access tokens
- **Format**: `1d` (1 day), `1h` (1 hour), `30m` (30 minutes)
- **Recommended**: `1d` for development, `15m` for production
- **Example**: `ACCESS_TOKEN_EXPIRES_IN=1d`

### `REFRESH_TOKEN_EXPIRES_IN`

- **Description**: Expiration time for refresh tokens
- **Format**: Same as access token
- **Recommended**: `7d` for development, `30d` for production
- **Example**: `REFRESH_TOKEN_EXPIRES_IN=7d`

## 🗄️ Database Configuration

### `MONGODB_URI`

- **Description**: MongoDB connection string
- **Format**: `mongodb+srv://<username>:<password>@<cluster>/<database>`

#### How to get MongoDB URI:

1. **MongoDB Atlas (Cloud - Recommended)**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free account
   - Create a new cluster
   - Go to "Database Access" → Create database user
   - Go to "Network Access" → Add IP address (0.0.0.0/0 for development)
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Local MongoDB**:
   - Install MongoDB locally
   - Use: `mongodb://localhost:27017/yolohub`

- **Example**: `MONGODB_URI=mongodb+srv://admin:password123@cluster0.vid5pag.mongodb.net/yolohub`

## 🤖 AI Integration

### `GEMINI_API_KEY`

- **Description**: Google Gemini AI API key for chatbot functionality
- **How to get**:
  1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Sign in with your Google account
  3. Click "Create API Key"
  4. Copy the generated key
- **Example**: `GEMINI_API_KEY=AIzaSyD...`
- **Usage**: Used for AI-powered chatbot responses and content generation

## 💳 Payment Gateways

### SePay Configuration (Vietnamese Payment Gateway)

#### `SEPAY_API_KEY`

- **Description**: SePay API key for Vietnamese payment processing
- **How to get**:
  1. Visit [SePay](https://sepay.vn/)
  2. Register for a business account
  3. Complete verification process
  4. Access developer dashboard
  5. Generate API key
- **Example**: `SEPAY_API_KEY=sp_test_...`

### Stripe Configuration (International Payments)

#### `STRIPE_SECRET_KEY`

- **Description**: Stripe secret key for payment processing
- **How to get**:
  1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
  2. Create account or sign in
  3. Go to "Developers" → "API keys"
  4. Copy "Secret key" (starts with `sk_test_` for test mode)
- **Example**: `STRIPE_SECRET_KEY=sk_test_51H...`

#### `STRIPE_PUBLISHABLE_KEY`

- **Description**: Stripe publishable key for frontend integration
- **How to get**: Same location as secret key (starts with `pk_test_`)
- **Example**: `STRIPE_PUBLISHABLE_KEY=pk_test_51H...`

#### `STRIPE_WEBHOOK_SECRET`

- **Description**: Webhook endpoint secret for secure event handling
- **How to get**:
  1. In Stripe Dashboard → "Developers" → "Webhooks"
  2. Create new endpoint: `https://yourdomain.com/api/webhooks/stripe`
  3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
  4. Copy "Signing secret"
- **Example**: `STRIPE_WEBHOOK_SECRET=whsec_...`

#### `STRIPE_CURRENCY`

- **Description**: Default currency for Stripe payments
- **Value**: `vnd` (Vietnamese Dong)
- **Example**: `STRIPE_CURRENCY=vnd`
- **Note**: Ensure your Stripe account supports VND

## 📧 Email Configuration

### Gmail SMTP Setup (Recommended)

#### `EMAIL_HOST`

- **Value**: `smtp.gmail.com`
- **Example**: `EMAIL_HOST=smtp.gmail.com`

#### `EMAIL_PORT`

- **Value**: `587` (TLS) or `465` (SSL)
- **Example**: `EMAIL_PORT=587`

#### `EMAIL_USERNAME`

- **Description**: Your Gmail address
- **Example**: `EMAIL_USERNAME=youremail@gmail.com`

#### `EMAIL_PASSWORD`

- **Description**: Gmail App Password (not your regular password)
- **How to get**:
  1. Enable 2-Factor Authentication on your Google account
  2. Go to [Google Account Settings](https://myaccount.google.com/)
  3. Security → 2-Step Verification → App passwords
  4. Generate app password for "Mail"
  5. Use the 16-character password
- **Example**: `EMAIL_PASSWORD=abcd efgh ijkl mnop`

#### `EMAIL_FROM`

- **Description**: Sender email address
- **Value**: Same as EMAIL_USERNAME
- **Example**: `EMAIL_FROM=youremail@gmail.com`

#### `EMAIL_FROM_NAME`

- **Description**: Display name for sent emails
- **Example**: `EMAIL_FROM_NAME=YoloHub LMS`

### Alternative Email Providers

#### SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USERNAME=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

#### Mailgun

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USERNAME=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your_mailgun_password
```

## 🔐 OAuth Configuration

### `GOOGLE_CLIENT_ID`

- **Description**: Google OAuth client ID for Google Sign-In
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create new project or select existing
  3. Enable "Google+ API"
  4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
  5. Application type: "Web application"
  6. Authorized redirect URIs: `http://localhost:8888/api/auth/google/callback`
  7. Copy Client ID
- **Example**: `GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com`

## 📁 Environment Files

### File Structure

```
├── .env                    # Main environment file (git-ignored)
├── .env-development.txt    # Development template
├── .env.example           # Public example file
└── .env.production        # Production configuration
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different secrets** for each environment
3. **Rotate secrets regularly** in production
4. **Use strong, random passwords** (minimum 32 characters)
5. **Limit database access** by IP address
6. **Enable 2FA** on all service accounts

### Environment-Specific Configurations

#### Development

```env
NODE_ENV=development
PORT=8888
FRONTEND_URL=http://localhost:4000
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
```

#### Production

```env
NODE_ENV=production
PORT=8888
FRONTEND_URL=https://yourdomain.com
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Failed

```
Error: MongoNetworkError: failed to connect to server
```

**Solutions**:

- Check MongoDB URI format
- Verify database user credentials
- Ensure IP address is whitelisted in MongoDB Atlas
- Check network connectivity

#### Email Sending Failed

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions**:

- Use App Password instead of regular Gmail password
- Enable 2-Factor Authentication
- Check EMAIL_USERNAME and EMAIL_PASSWORD values

#### Stripe Webhook Verification Failed

```
Error: No signatures found matching the expected signature for payload
```

**Solutions**:

- Verify STRIPE_WEBHOOK_SECRET is correct
- Ensure webhook endpoint URL is correct
- Check webhook events are properly configured

#### Google OAuth Error

```
Error: redirect_uri_mismatch
```

**Solutions**:

- Add correct redirect URI in Google Cloud Console
- Ensure FRONTEND_URL matches OAuth configuration
- Check GOOGLE_CLIENT_ID is correct

## 📞 Support

If you need help with environment configuration:

1. Check the [main documentation](../README.md)
2. Review service-specific documentation:
   - [Stripe Test Cards](./STRIPE_TEST_CARDS.md)
3. Contact support with specific error messages

## 🔄 Updates

This documentation is updated regularly. Last updated: October 2024

---

**⚠️ Security Warning**: Never share your environment variables publicly or commit them to version control. Always use secure, unique values for production environments.
