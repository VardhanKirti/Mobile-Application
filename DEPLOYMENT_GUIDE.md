# 🚀 Deployment Guide - Fix Google Auth for Global Access

## The Problem
Every device generates a different redirect URI, causing "Error 400: redirect_uri_mismatch"

## The Solution
Deploy to a production domain with a **single, fixed redirect URI** that works for all users.

---

## Quick Fix (Development Only)

If you want to test quickly without deploying, add these URLs to Google Cloud Console:

1. Go to: https://console.cloud.google.com → APIs & Services → Credentials
2. Edit your Web Client ID: `680180840921-bf7fdo87i3secg5dbkris5uhkfj7ped8`
3. Add to **Authorized Redirect URIs**:

```
https://auth.expo.io/@anonymous/property-app
https://auth.expo.io/@anirban/property-app
```

This makes Expo's proxy server handle auth for all users.

---

## Production Deployment (Recommended)

### Option 1: Deploy to Netlify (Free)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the web app
npx expo export --platform web

# Deploy to Netlify
netlify deploy --dir dist --prod
```

Then:
1. Get your Netlify URL (e.g., `https://cultfit-properties-123.netlify.app`)
2. Add it to Google Cloud Console → Credentials → Authorized Redirect URIs:
   ```
   https://cultfit-properties-123.netlify.app
   ```
3. Update `GoogleAuthScreen.js`:
   ```javascript
   const isProduction = true;
   // And set your domain
   ```

### Option 2: Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npx expo export --platform web
vercel --prod
```

---

## Update GoogleAuthScreen.js for Production

```javascript
// PRODUCTION FIX: Use proxy for development, direct URI for production
const isProduction = true; // Change to true when deployed

const redirectUri = isProduction 
  ? 'https://your-domain.netlify.app' // Your production domain
  : makeRedirectUri({ useProxy: true });

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: WEB_CLIENT_ID,
  webClientId: WEB_CLIENT_ID,
  useProxy: !isProduction, // Use proxy only in development
  redirectUri,
});
```

---

## Google Cloud Console Configuration

After deployment, add these to your Web Client ID:

### Authorized JavaScript Origins:
```
https://your-domain.netlify.app
https://cultfit-properties.netlify.app (your actual domain)
```

### Authorized Redirect URIs:
```
https://your-domain.netlify.app
https://auth.expo.io/@anonymous/property-app (for mobile testing)
```

---

## Role-Based Access (Already Configured)

Your app now uses:

- **ADMIN_EMAILS** in `AuthContext.js` - Whitelist for full CRUD access
- **All other users** - Automatic "viewer" role (read-only)

Current admin whitelist:
```javascript
const ADMIN_EMAILS = [
  'admin@example.com',
  'kirti.sharma@curefit.com',
  'anirban@curefit.com',
];
```

To add more admins, edit `src/context/AuthContext.js` and add emails to `ADMIN_EMAILS` array.

---

## Mobile App (Expo Go)

For physical device testing:
1. Keep `useProxy: true` for mobile
2. The app will use `https://auth.expo.io/@anonymous/property-app`
3. Make sure this URL is in your Google Cloud Console redirect URIs

---

## Testing the Flow

1. **New User Signs In**: Gets "viewer" role automatically
2. **Admin Signs In**: Gets "admin" role if email is in whitelist
3. **Viewer Access**: Can view properties but cannot add/edit/delete
4. **Admin Access**: Full CRUD operations

---

## Troubleshooting

### Error 400: redirect_uri_mismatch
- Redirect URI is not added to Google Cloud Console
- Check the debug box on the login screen - it shows the exact URL to add

### Error 401: invalid_client
- Client ID is incorrect
- Use: `680180840921-bf7fdo87i3secg5dbkris5uhkfj7ped8.apps.googleusercontent.com`

### Firebase: Permission Denied
- Check Firestore rules allow authenticated users
- Go to Firebase Console → Firestore Database → Rules

---

## Summary

✅ **For immediate testing**: Add `https://auth.expo.io/@anonymous/property-app` to Google Console  
✅ **For production**: Deploy to Netlify/Vercel and use a fixed domain  
✅ **All new users**: Get automatic "viewer" (read-only) access  
✅ **Admins**: Full CRUD via email whitelist in `AuthContext.js`
