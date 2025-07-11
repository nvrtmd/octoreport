#!/usr/bin/env node
import 'dotenv/config';

import inquirer from 'inquirer';

import { getUserPRListByCreationAndParticipation } from './core';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'username',
    message: 'Please enter your GitHub username (e.g., octocat):',
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
    githubToken: process.env.GITHUB_TOKEN ?? '',
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
