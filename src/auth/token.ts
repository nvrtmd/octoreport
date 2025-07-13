import keytar from 'keytar';

const { getPassword, setPassword } = keytar;
import { getUserInfo } from './userInfo';

export async function getGithubToken(): Promise<string> {
  const githubEmail = getUserInfo().email;
  if (!githubEmail) {
    throw new Error('GitHub email not found. Please log in first.');
  }
  return (await getPassword('octoreport', githubEmail)) ?? '';
}

export async function setGithubToken(token: string) {
  const githubEmail = getUserInfo().email;
  if (!githubEmail) {
    throw new Error('GitHub email not found. Please log in first.');
  }
  await setPassword('octoreport', githubEmail, token);
}
