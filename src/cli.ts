#!/usr/bin/env node
import 'dotenv/config';

import inquirer from 'inquirer';

import { getUserPRListByCreationAndParticipation } from './core';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'username',
    message: '깃헙 유저네임을 입력하세요:',
  },
  {
    type: 'input',
    name: 'repository',
    message: '저장소를 입력하세요 (예: owner/repo):',
  },
  {
    type: 'input',
    name: 'startDate',
    message: '시작 날짜를 입력하세요 (YYYY-MM-DD):',
  },
  {
    type: 'input',
    name: 'endDate',
    message: '종료 날짜를 입력하세요 (YYYY-MM-DD):',
  },
  {
    type: 'input',
    name: 'targetBranch',
    message: '타겟 브랜치를 입력하세요 (옵션, 엔터로 생략):',
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
