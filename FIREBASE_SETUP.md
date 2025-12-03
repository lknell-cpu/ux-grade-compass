# Firebase Authentication Setup Guide

This app uses Firebase Authentication with Google Sign-In, restricted to @salesforce.com email addresses.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it and add your support email
4. **Important:** Under "Authorized domains", add:
   - `localhost` (for local development)
   - Your Heroku domain: `ux-grade-compass-303bfd244050.herokuapp.com`
5. Click **Save**

### 3. Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "UX Grade Compass")
5. Copy the `firebaseConfig` object values

### 4. Create Local Environment File

Create a file named `.env.local` in the project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note:** The `.env.local` file is gitignored and won't be committed.

### 5. Configure Heroku Environment Variables

Set the same environment variables on Heroku:

```bash
heroku config:set VITE_FIREBASE_API_KEY=your_api_key_here
heroku config:set VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
heroku config:set VITE_FIREBASE_PROJECT_ID=your_project_id
heroku config:set VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
heroku config:set VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
heroku config:set VITE_FIREBASE_APP_ID=your_app_id
```

Or set them via the Heroku Dashboard:
1. Go to your app's **Settings** tab
2. Click **Reveal Config Vars**
3. Add each variable

### 6. (Optional) Restrict to Salesforce Domain in Google Cloud

For extra security, you can restrict your Google OAuth app to salesforce.com:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add authorized JavaScript origins and redirect URIs for your domains

## How It Works

- The app uses Firebase Authentication with Google provider
- The `googleProvider` is configured with `hd: 'salesforce.com'` to prefer Salesforce accounts
- After authentication, the app checks if the email ends with `@salesforce.com`
- Non-Salesforce users are automatically signed out with an error message

## Testing Locally

1. Make sure `.env.local` is created with your Firebase credentials
2. Run `npm run dev`
3. Try signing in with a @salesforce.com email
4. Try signing in with a non-Salesforce email (should be rejected)

## Deployment

After setting up Heroku config vars, just push your code:

```bash
git push origin main
```

Then redeploy on Heroku dashboard or via CLI.

