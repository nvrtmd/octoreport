import { describe, it, expect, beforeAll } from 'vitest';

import {
  getAllPRListInPeriod,
  getUserCreatedPRListInPeriod,
  getPRCount,
  getPRCountByLabel,
  separatePRListByUserParticipation,
  getUserPRRatio,
} from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('getPRCount', () => {
  it('returns the number of pull requests in the given period', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = getPRCount(prList);

    expect(result).toEqual(2);
  });
});

describe('getPRCountByLabel', () => {
  it('counts pull requests created by the user within the specified period, grouped by label, and returns an object like {feat: 10, fix: 2, test: 10, ...}', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = getPRCountByLabel(prList);

    expect(result).toEqual({
      docs: 1,
      'regression 🐛': 1,
      'v5.x': 2,
      'bug 🐛': 1,
      examples: 1,
    });
  });

  it('counts pull requests with no labels as "N/A" in the label count result', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'alexfauquette',
      repository: 'mui/material-ui',
      period: { startDate: '2024-10-01', endDate: '2024-10-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = getPRCountByLabel(prList);

    expect(result).toEqual({
      'N/A': 1,
    });
  });
});

describe('separatePRListByUserParticipation', () => {
  it('separates PR list into created and participated PRs for a specific user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-31' },
      targetBranch: 'master',
    });

    const result = separatePRListByUserParticipation(prList, 'oliviertassinari');

    expect(result).toMatchSnapshot();
  });
});

describe('getUserPRRatio', () => {
  it('returns the ratio of pull requests the user has requested within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-25' },
      targetBranch: 'master',
    });

    const result = getUserPRRatio(prList, 'oliviertassinari');

    expect(result).toEqual(6 / 38);
  });
});
