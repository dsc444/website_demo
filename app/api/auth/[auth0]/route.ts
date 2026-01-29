import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin((req) => {
    console.log("DOCKER_LOG: Login attempt initiated");
    return { returnTo: '/dashboard' };
  }),
  callback: async (req, res) => {
    console.log("DOCKER_LOG: Callback/Exchange initiated");
    try {
      return await handleAuth()(req, res);
    } catch (error) {
      console.error("DOCKER_LOG: Exchange Error:", error);
      throw error;
    }
  }
});