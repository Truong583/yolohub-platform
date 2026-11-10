# Environment Variables Documentation

This document explains all environment variables used in the YoloHub UI application and provides step-by-step instructions on how to obtain their values.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [File Upload Service](#file-upload-service)
- [API Configuration](#api-configuration)
- [Payment Integration](#payment-integration)
- [OAuth Providers](#oauth-providers)
- [Next.js Authentication](#nextjs-authentication)
- [Application URLs](#application-urls)

---

## Setup Instructions

1. Copy `.env.local` to `.env` in the root directory:

   ```bash
   cp .env.local .env
   ```

2. Fill in the values following the instructions below
3. Never commit `.env` to version control (it should be in `.gitignore`)

---

## File Upload Service

### `UPLOADTHING_TOKEN`

**Description:** Secret token for UploadThing file upload service.

**How to Get:**

1. Go to [https://uploadthing.com](https://uploadthing.com)
2. Sign up or log in to your account
3. Create a new app or select an existing one
4. Navigate to the "API Keys" section
5. Copy the **Secret Key** (not the App ID)
6. Paste it as the value for `UPLOADTHING_TOKEN`

**Example:**

```env
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

**Security:** ⚠️ **KEEP SECRET** - This is a secret token and should never be shared or committed to version control.

---

## API Configuration

### `NEXT_PUBLIC_API_URL`

**Description:** The base URL for your backend API server.

**How to Get:**

- **Development:** Use your local backend server URL (default: `http://localhost:8888/api/v1`)
- **Production:** Use your deployed backend API URL (e.g., `https://api.yolohub.com/api/v1`)

**Example:**

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8888/api/v1

# Production
NEXT_PUBLIC_API_URL=https://api.yolohub.com/api/v1
```

**Security:** ✅ **PUBLIC** - This variable is prefixed with `NEXT_PUBLIC_` and will be exposed to the browser.

---

## Payment Integration

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Description:** Stripe publishable key for processing payments.

**How to Get:**

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up or log in to your Stripe account
3. Navigate to **Developers** → **API Keys**
4. Copy the **Publishable key**
   - For testing: Use the key that starts with `pk_test_`
   - For production: Use the key that starts with `pk_live_`

**Example:**

```env
# Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABCDEabcde1234567890XYZxyz

# Live Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51ABCDEabcde1234567890XYZxyz
```

**Security:** ✅ **SAFE TO EXPOSE** - Publishable keys are designed to be included in client-side code.

**Note:** You'll also need to configure the Stripe Secret Key on your backend server.

---

## OAuth Providers

### Google OAuth

#### `GOOGLE_CLIENT_ID`

**Description:** Google OAuth 2.0 Client ID for social login.

**How to Get:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Configure authorized redirect URIs:
   ```
   http://localhost:4000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
7. Click **Create** and copy the **Client ID**

**Example:**

```env
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

**Security:** ⚠️ **GENERALLY SAFE** - While not as sensitive as the secret, it's still recommended to keep it private.

---

#### `GOOGLE_CLIENT_SECRET`

**Description:** Google OAuth 2.0 Client Secret.

**How to Get:**

1. Follow the same steps as `GOOGLE_CLIENT_ID`
2. After creating the OAuth client, copy the **Client Secret**

**Example:**

```env
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Security:** ⚠️ **KEEP SECRET** - This is highly sensitive and should never be shared or committed to version control.

---

### Facebook OAuth

#### `FACEBOOK_CLIENT_ID`

**Description:** Facebook App ID for social login.

**How to Get:**

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click **My Apps** → **Create App**
3. Select **Consumer** as the app type
4. Fill in the app details and create the app
5. Navigate to **Settings** → **Basic**
6. Copy the **App ID**
7. Add your OAuth redirect URIs in **Facebook Login** → **Settings**:
   ```
   http://localhost:4000/api/auth/callback/facebook
   https://yourdomain.com/api/auth/callback/facebook
   ```

**Example:**

```env
FACEBOOK_CLIENT_ID=your_facebook_client_id_here
```

**Security:** ⚠️ **GENERALLY SAFE** - While not as sensitive as the secret, it's still recommended to keep it private.

---

#### `FACEBOOK_CLIENT_SECRET`

**Description:** Facebook App Secret for OAuth.

**How to Get:**

1. Follow the same steps as `FACEBOOK_CLIENT_ID`
2. In **Settings** → **Basic**, copy the **App Secret**
3. You may need to verify your Facebook account to view the secret

**Example:**

```env
FACEBOOK_CLIENT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Security:** ⚠️ **KEEP SECRET** - This is highly sensitive and should never be shared or committed to version control.

---

## Next.js Authentication

### `NEXTAUTH_URL`

**Description:** The canonical URL of your site. Used by NextAuth.js for OAuth callbacks.

**How to Get:**

- **Development:** Use `http://localhost:4000` (or your local dev port)
- **Production:** Use your production domain (e.g., `https://yolohub.com`)

**Example:**

```env
# Development
NEXTAUTH_URL=http://localhost:4000

# Production
NEXTAUTH_URL=https://yolohub.com
```

**Important:** This URL **must match** the redirect URIs configured in your OAuth providers (Google, Facebook).

**Security:** ✅ **PUBLIC** - This is your application's URL.

---

### `NEXTAUTH_SECRET`

**Description:** Secret key used to encrypt JWT tokens and session data.

**How to Get:**

Generate a strong random secret using one of these methods:

**Option 1: Using OpenSSL (Recommended)**

```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**

- Use [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

**Example:**

```env
NEXTAUTH_SECRET=your_generated_secret_here_32_characters_long
```

**Security:** ⚠️ **KEEP SECRET** - This is critical for security. Use a different secret for development and production.

---

## Application URLs

### `NEXT_PUBLIC_SITE_URL`

**Description:** The public URL of your frontend application.

**How to Get:**

- **Development:** Use `http://localhost:4000` (or your local dev port)
- **Production:** Use your production domain (e.g., `https://yolohub.com`)

**Example:**

```env
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:4000

# Production
NEXT_PUBLIC_SITE_URL=https://yolohub.com
```

**Security:** ✅ **PUBLIC** - This variable is prefixed with `NEXT_PUBLIC_` and will be exposed to the browser.

**Note:** This should typically match `NEXTAUTH_URL`.

---

## Complete Example

Here's a complete example of a properly configured `.env.local` file:

```env
# File Upload
UPLOADTHING_TOKEN=your_uploadthing_token_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8888/api/v1

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your_strong_random_secret_32_chars
NEXT_PUBLIC_SITE_URL=http://localhost:4000
```

---

## Security Best Practices

### ⚠️ Secret Variables (Never Share or Commit)

- `UPLOADTHING_TOKEN`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_SECRET`
- `NEXTAUTH_SECRET`

### ⚠️ Semi-Private Variables (Keep Private When Possible)

- `GOOGLE_CLIENT_ID`
- `FACEBOOK_CLIENT_ID`

### ✅ Public Variables (Safe to Expose)

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXTAUTH_URL`

---

## Troubleshooting

### Google OAuth Redirect Issue

**Problem:** Google OAuth returns "redirect_uri_mismatch" error.

**Solution:** Ensure `NEXTAUTH_URL` matches the authorized redirect URI in Google Cloud Console:

- Check that both URLs are identical (including protocol, domain, and port)
- Verify you've added `/api/auth/callback/google` to the authorized redirect URIs
- Example: `http://localhost:4000/api/auth/callback/google`

### Facebook OAuth Not Working

**Problem:** Facebook login fails or shows error.

**Solution:**

- Ensure your Facebook App is in "Live" mode (not Development)
- Add your domain to the App Domains in Facebook App settings
- Verify redirect URIs are properly configured
- Check that `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET` are correct

### File Upload Fails

**Problem:** File uploads not working.

**Solution:**

- Verify `UPLOADTHING_TOKEN` is the **Secret Key**, not the App ID
- Check that the token hasn't expired
- Ensure you've configured allowed file types in UploadThing dashboard

### API Connection Issues

**Problem:** Cannot connect to backend API.

**Solution:**

- Verify `NEXT_PUBLIC_API_URL` is correct and includes the full path (e.g., `/api/v1`)
- Ensure your backend server is running
- Check for CORS issues if backend and frontend are on different domains

---

## Support

For additional help:

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- Visit [UploadThing Documentation](https://docs.uploadthing.com)
- Read [Stripe Documentation](https://stripe.com/docs)

---

**Last Updated:** October 2025
