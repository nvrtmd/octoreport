import ora, { Ora } from 'ora';

import { login } from '../../auth/login';
import { getGithubToken } from '../../auth/token';
import { promptCommonQuestions } from '../prompts';

export async function withCommonSetup<T>(
  command: (
    answers: Awaited<ReturnType<typeof promptCommonQuestions>>,
    githubToken: string,
    username: string,
    spinner: Ora,
  ) => Promise<T>,
) {
  const { email, username } = await login();
  const githubToken = await getGithubToken(email);
  const answers = await promptCommonQuestions();

  const spinner = ora({
    text: '🐙🔎 Processing...',
    spinner: 'dots2',
    color: 'green',
  }).start();

  try {
    await command(answers, githubToken, username, spinner);
  } catch (error) {
    const errorMessage = error instanceof Error && error.message ? error.message : 'Unknown error';
    spinner.fail(`❌ Failed to execute command: ${errorMessage}. Please try again.`);
    console.error(error);
  } finally {
    spinner.stop();
  }
}
