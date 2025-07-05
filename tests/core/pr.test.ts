import { config } from 'dotenv';
import { describe, expect, it } from 'vitest';

import { getUserCreatedPRListInPeriod, getUserCreatedPRListInPeriodByLabel } from '../../src/core';
config();

describe('getUserCreatedPRListInPeriod', () => {
  it('returns an empty array when the user has no pull requests in the given period', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2015-01-01', endDate: '2015-01-10' },
      targetBranch: 'mui:master',
    });

    expect(result).toEqual([]);
  });

  it('returns pull requests created by the user within the specified date range', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-31' },
      targetBranch: 'mui:master',
    });

    expect(result).toMatchSnapshot();
  });

  it('filters pull requests that target a specific branch', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN ?? '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    expect(result).toMatchSnapshot();
  });
});

describe('getUserCreatedPRListInPeriodByLabel', () => {
  it('filters pull requests that exactly match provided label names (case-sensitive)', async () => {
    const result = await getUserCreatedPRListInPeriodByLabel({
      githubToken: process.env.GITHUB_TOKEN ?? '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-31' },
      targetBranch: 'mui:master',
      labelFilter: ['docs'],
    });

    expect(result).toMatchSnapshot();
  });
});
