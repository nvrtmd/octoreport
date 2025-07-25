import { describe, it, expect, beforeAll } from 'vitest';

import {
  getAllPRListInPeriod,
  getUserCreatedPRListInPeriod,
  getPRCount,
  getPRCountByLabel,
  separatePRListByUserParticipation,
  getUserCreatedPRRatio,
  groupPRListByLabel,
  getUserParticipatedPRRatio,
} from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('groupPRListByLabel', () => {
  it('returns the pull requests grouped by label', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-10' },
      targetBranch: 'master',
    });

    const result = groupPRListByLabel(prList);

    expect(result).toMatchSnapshot();
  });
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

describe('getUserCreatedPRRatio', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = getUserCreatedPRRatio(prList, 'oliviertassinari');

    expect(result).toEqual(6 / 30);
  });
});

describe('getUserParticipatedPRRatio', () => {
  it('returns the ratio of pull requests the user has participated in within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });
    const result = getUserParticipatedPRRatio(prList, 'oliviertassinari');
    expect(result).toEqual(18 / 30);
  });
});
