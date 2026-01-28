import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  appBaseUrl: process.env.APP_BASE_URL,
  secret: process.env.AUTH0_SECRET,

  async beforeSessionSaved(session, idToken) {
    const namespace = 'https://fin-and-fillet.com';
    
    // Log this to your terminal during login to see if it sees the roles
    console.log("ID Token Claims:", idToken);

    //if (idToken && idToken[`${namespace}/roles`]) {
    //  session.user[`${namespace}/roles`] = idToken[`${namespace}/roles`];
    //}
    if (idToken && (idToken as any)[`${namespace}/roles`]) {
      (session.user as any)[`${namespace}/roles`] = (idToken as any)[`${namespace}/roles`];
    }
    
    return session;
  } // <--- Added missing closing brace for the function
}); // <--- Correctly closes the Auth0Client