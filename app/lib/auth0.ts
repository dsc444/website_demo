import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // Make sure this variable name matches what is actually in your .env
  appBaseUrl: process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL, 
  secret: process.env.AUTH0_SECRET,
// 1. Rename and move this out of the routes object
  postLogoutRedirect: '/', 

  routes: {
    callback: '/api/auth/callback',
    // 2. ONLY keep callback and login here if needed
  },

  async beforeSessionSaved(session, idToken) {
    const namespace = 'https://fin-and-fillet.com';
    console.log("ID Token Claims:", idToken);

    if (idToken && (idToken as any)[`${namespace}/roles`]) {
      (session.user as any)[`${namespace}/roles`] = (idToken as any)[`${namespace}/roles`];
    }
    
    return session;
  }
});