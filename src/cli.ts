#!/usr/bin/env node
import inquirer from 'inquirer';

import { fetchGitHubUserInfo } from './api/github';
import { loginWithGitHubDeviceFlow } from './auth/login';
import { getGithubToken, setGithubToken } from './auth/token';
import { getUserInfo, setUserInfo } from './auth/userInfo';
import { getUserPRListByCreationAndParticipation } from './core';

const GITHUB_CLIENT_ID = 'Ov23lia7pFpgs8ULT1DL';
const { username: githubUsername, email: githubEmail } = getUserInfo();

if (process.argv[2] === 'login' || !githubEmail || !(await getGithubToken(githubEmail))) {
  const token = await loginWithGitHubDeviceFlow(GITHUB_CLIENT_ID);
  const user = await fetchGitHubUserInfo(token);
  setUserInfo(user);
  await setGithubToken(user.email, token);
  console.log(
    '🎉 Successfully logged in! You can now use octoreport. Please run the command again.',
  );
  process.exit(0);
}

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'username',
    message:
      'Optionally, enter the target GitHub username (e.g., octocat) (press Enter to skip and show PRs created by you):',
  },
  {
    type: 'input',
    name: 'repository',
    message: 'Please enter the repository in the format "owner/repo" (e.g., facebook/react):',
  },
  {
    type: 'input',
    name: 'startDate',
    message: 'Please enter the start date for the search period (format: YYYY-MM-DD):',
  },
  {
    type: 'input',
    name: 'endDate',
    message: 'Please enter the end date for the search period (format: YYYY-MM-DD):',
  },
  {
    type: 'input',
    name: 'targetBranch',
    message:
      'Optionally, enter the target branch to filter pull requests (press Enter to skip and show PRs targeting all branches):',
  },
]);

const githubToken = await getGithubToken(githubEmail);
const { userCreatedPRList, userParticipatedPRList } = await getUserPRListByCreationAndParticipation(
  {
    githubToken,
    username: answers.username || githubUsername,
    repository: answers.repository,
    period: {
      startDate: answers.startDate,
      endDate: answers.endDate,
    },
    targetBranch: answers.targetBranch,
  },
);

console.log('User Created PRs: ', userCreatedPRList);
console.log('User Participated PRs: ', userParticipatedPRList);
