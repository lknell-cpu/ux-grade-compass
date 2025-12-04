# Firebase Setup Guide

This guide will help you configure Firebase Authentication with Google Sign-In for the UX Grade Compass app.

---

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name: `ux-grade-compass` (or your preferred name)
4. (Optional) Disable Google Analytics if not needed
5. Click **"Create project"**
6. Wait for project to be created, then click **"Continue"**

---

## Step 2: Add Web App to Firebase Project

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register your app:
   - **App nickname:** `UX Grade Compass` (or your preferred name)
   - **Firebase Hosting:** Check this if you plan to use Firebase Hosting
3. Click **"Register app"**
4. **Copy the Firebase configuration** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

5. Click **"Continue to console"**

---

## Step 3: Enable Google Authentication

1. In the Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"** (if it's your first time)
3. Click on the **"Sign-in method"** tab
4. Find **"Google"** in the list of providers
5. Click on **"Google"** to expand it
6. Toggle the **"Enable"** switch
7. Set a **Project support email** (required) - use your email
8. Click **"Save"**

---

## Step 4: Enable Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose a location for your database (select the closest to your users)
5. Click **"Enable"**

### Set Firestore Security Rules

1. Click on the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own analytics data
    match /analytics_signins/{document=**} {
      allow write: if request.auth != null;
      allow read: if request.auth != null && request.auth.token.email == 'lknell@salesforce.com';
    }
    
    match /analytics_visits/{document=**} {
      allow write: if request.auth != null;
      allow read: if request.auth != null && request.auth.token.email == 'lknell@salesforce.com';
    }
    
    match /analytics_comparisons/{document=**} {
      allow write: if request.auth != null;
      allow read: if request.auth != null && request.auth.token.email == 'lknell@salesforce.com';
    }
  }
}
```

3. Click **"Publish"**

**Note:** These rules allow all authenticated users to write analytics data, but only the admin (lknell@salesforce.com) can read the analytics.

---

## Step 5: Configure Environment Variables

### Option A: Using vite.config.js (Current Implementation)

The Firebase config is currently hardcoded in `vite.config.js`:

```javascript
define: {
  'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify('YOUR_API_KEY'),
  'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify('YOUR_PROJECT_ID.firebaseapp.com'),
  'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify('YOUR_PROJECT_ID'),
  'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify('YOUR_PROJECT_ID.firebasestorage.app'),
  'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify('YOUR_MESSAGING_SENDER_ID'),
  'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify('YOUR_APP_ID'),
}
```

**Replace the values** with your Firebase configuration from Step 2.

### Option B: Using .env File (Recommended for Production)

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note:** All Vite environment variables must be prefixed with `VITE_`

---

## Step 6: Configure Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"**
3. Add your production domain(s):
   - `localhost` (already added by default)
   - Your Heroku domain: `your-app-name.herokuapp.com`
   - Any custom domains

---

## Step 7: Test Authentication and Analytics

1. Start the development server:
```bash
npm run dev
```

2. Open the app in your browser
3. You should be redirected to `/login`
4. Click **"Sign in with Google"**
5. Try signing in with:
   - ✅ A `@salesforce.com` email (should succeed)
   - ❌ A non-Salesforce email (should show error)

---

## Testing Checklist

- [ ] User can access login page at `/login`
- [ ] Google Sign-In button appears and works
- [ ] @salesforce.com email can sign in successfully
- [ ] Non-Salesforce email is rejected with error message
- [ ] User is redirected to main app after successful login
- [ ] User menu appears in header when logged in
- [ ] Clicking user menu shows dropdown with email and sign out
- [ ] Sign out button logs user out and redirects to login
- [ ] Trying to access `/` while logged out redirects to login
- [ ] Authentication persists on page refresh
- [ ] Clicking outside user menu closes the dropdown
- [ ] Admin user (lknell@salesforce.com) can see Analytics link in user menu
- [ ] Analytics page loads and displays data
- [ ] Non-admin users cannot access /analytics route

---

## Deployment to Heroku

### Environment Variables

Set Firebase config in Heroku:

```bash
heroku config:set VITE_FIREBASE_API_KEY=your_api_key
heroku config:set VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
heroku config:set VITE_FIREBASE_PROJECT_ID=your_project_id
heroku config:set VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
heroku config:set VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
heroku config:set VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Remove hardcoded values from `vite.config.js` before deploying to production.

### Update Authorized Domains

Add your Heroku domain to Firebase Console → Authentication → Settings → Authorized domains

---

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"

**Solution:** Add your domain to Authorized domains in Firebase Console

### Error: "Access restricted to @salesforce.com email addresses only"

**Expected behavior** - Only Salesforce emails are allowed. This is by design.

### Error: "Firebase: Error (auth/popup-closed-by-user)"

**Solution:** User closed the Google Sign-In popup. They need to try again.

### Authentication not persisting after refresh

**Solution:** Check that `onAuthStateChanged` is properly set up in `AuthContext.jsx`

---

## Security Notes

- Firebase API keys are safe to expose in frontend code
- Real security comes from Firebase Security Rules and domain restrictions
- The `hd: 'salesforce.com'` parameter restricts the Google Sign-In picker
- Backend validation checks email domain and signs out non-Salesforce users
- All routes except `/login` are protected by `PrivateRoute`

---

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In for Websites](https://developers.google.com/identity/sign-in/web)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Need help?** Contact the app maintainer or refer to `IMPLEMENTATION_CHANGELOG.md` for implementation details.
