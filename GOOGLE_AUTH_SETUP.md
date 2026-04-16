# Google Authentication Setup Guide

## Fix the "OAuth Client Not Found" Error

The app requires Google OAuth credentials to enable "Sign in with Google".

### Option 1: Get Web Client ID from Firebase (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `testing-anirban`
3. **Click Project Settings** (gear icon next to Project Overview)
4. **Go to General tab** → **Your apps** section
5. **Look for your Web App** in the list
6. **Copy the `clientId`** or find it under SDK setup and configuration

### Option 2: Create OAuth Credentials in Google Cloud Console

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Select your Firebase project**
3. **Navigate to**: APIs & Services → Credentials
4. **Click "Create Credentials"** → OAuth client ID
5. **Application type**: Web application
6. **Authorized JavaScript origins**: Add these:
   - `http://localhost:8081`
   - `http://localhost:8082`
   - `http://localhost:8084`
   - `http://localhost:8085`
   - Your production domain (if deployed)
7. **Authorized redirect URIs**: Add:
   - `https://auth.expo.io/@yourusername/property-app`
8. **Click Create** and copy the Client ID

### Step 3: Update the Code

Open `src/screens/GoogleAuthScreen.js` and update line 28-29:

```javascript
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
});
```

### Step 4: Enable Google Sign-in in Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. **Enable Google** provider
3. **Save**

### Alternative: Use Mock Login for Testing

If you just want to test the UI without Google Auth, modify `GoogleAuthScreen.js` to use email/password or a mock login temporarily.

### Testing on Mobile

For physical device testing with Expo Go:
1. The same client ID works for both web and mobile
2. On Android, you may need to add SHA-1 fingerprint in Firebase
3. Go to Firebase → Project Settings → Your Android App → SHA certificates

### Troubleshooting

**Error 401: invalid_client**
- Client ID is wrong or not configured
- Follow steps above to get correct Client ID

**Error: redirect_uri_mismatch**
- Add your Expo development URL to authorized redirect URIs
- Format: `https://auth.expo.io/@username/project-name`

**Error: Firebase permission denied**
- Check Firestore rules allow read/write for authenticated users
- Update rules in Firebase Console → Firestore Database → Rules
