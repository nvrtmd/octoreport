import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';

import { fetchGitHubUserInfo } from '../api/github';

import { getGithubToken, setGithubToken } from './token';
import { getUserInfo } from './userInfo';
import { setUserInfo } from './userInfo';

const GITHUB_CLIENT_ID = 'Ov23lia7pFpgs8ULT1DL';

export async function loginWithGitHubDeviceFlow(
  clientId: string,
  scopes: string[] = ['repo', 'read:user'],
) {
  const auth = createOAuthDeviceAuth({
    clientType: 'oauth-app',
    clientId,
    scopes,
    onVerification: (verification) => {
      console.log('🔐 GitHub authentication is required!');
      console.log(
        `👉 Please visit the following link in your browser: ${verification.verification_uri}`,
      );
      console.log(`✅ Enter the following code in the browser: ${verification.user_code}`);
    },
  });

  const authentication = await auth({ type: 'oauth' });
  return authentication.token;
}

export async function login() {
  const { email, username } = getUserInfo();
  const githubToken = email ? await getGithubToken(email) : null;

  if (!githubToken) {
    const newGithubToken = await loginWithGitHubDeviceFlow(GITHUB_CLIENT_ID);
    const user = await fetchGitHubUserInfo(newGithubToken);
    setUserInfo(user);
    await setGithubToken(user.email, newGithubToken);
    console.log(
      '🎉 Successfully logged in! You can now use octoreport. Please run the command again.',
    );
  }

  return { email, username };
}
