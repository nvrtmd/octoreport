#!/usr/bin/env node
import 'dotenv/config';

import { getUserCreatedPRListInPeriod } from './core';

const args = process.argv.slice(2);

const username = args[0];
const repository = args[1];
const period = {
  startDate: args[2],
  endDate: args[3],
};
const targetBranch = args[4];

const prList = await getUserCreatedPRListInPeriod({
  githubToken: process.env.GITHUB_TOKEN ?? '',
  username,
  repository,
  period,
  targetBranch,
});

console.log(prList);
