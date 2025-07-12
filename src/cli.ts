#!/usr/bin/env node
import inquirer from 'inquirer';

import { loginWithGitHubDeviceFlow } from './auth/login';
import { getToken, setToken } from './auth/token';
import { getUserPRListByCreationAndParticipation } from './core';

const GITHUB_CLIENT_ID = 'Ov23lia7pFpgs8ULT1DL';

if (process.argv[2] === 'login' || !getToken()) {
  const token = await loginWithGitHubDeviceFlow(GITHUB_CLIENT_ID);
  setToken(token);
  console.log('🎉 Authentication successful! You can now use octoreport.');
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

const { userCreatedPRList, userParticipatedPRList } = await getUserPRListByCreationAndParticipation(
  {
    githubToken: getToken() ?? '',
    username: answers.username,
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
