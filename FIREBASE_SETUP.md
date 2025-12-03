# Firebase Authentication Setup Guide

This app uses Firebase Google Authentication restricted to @salesforce.com email addresses.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if not needed)

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Click on **Google** in the providers list
4. Toggle the **Enable** switch
5. Add a project support email
6. Click **Save**

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to "Your apps" section
4. Click the **</>** (Web) icon to add a web app
5. Give it a nickname (e.g., "UX Grade Compass")
6. Click **Register app**
7. Copy the `firebaseConfig` object values

## Step 4: Create Local Environment File

Create a `.env` file in the root of your project with the following content:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration values.

## Step 5: Set Up Heroku Environment Variables

For your Heroku deployment, add the environment variables:

```bash
heroku config:set VITE_FIREBASE_API_KEY=your_api_key_here
heroku config:set VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
heroku config:set VITE_FIREBASE_PROJECT_ID=your_project_id
heroku config:set VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
heroku config:set VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
heroku config:set VITE_FIREBASE_APP_ID=your_app_id
```

Or set them through the Heroku dashboard:
1. Go to your app's Settings tab
2. Click "Reveal Config Vars"
3. Add each variable one by one

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** tab
2. Scroll to **Authorized domains**
3. Add your Heroku domain: `ux-grade-compass-303bfd244050.herokuapp.com`
4. `localhost` should already be there for local development

## Testing

1. Run locally: `npm run dev`
2. Try signing in with a @salesforce.com email - should work
3. Try signing in with a non-Salesforce email - should be rejected

## Security Notes

- The app checks email domain on the client side after authentication
- Only @salesforce.com emails are allowed
- Users are automatically signed out if they don't have a Salesforce email
- The Firebase config values in .env are safe to expose (they're client-side values)
- The actual security comes from Firebase Authentication rules and domain checking

