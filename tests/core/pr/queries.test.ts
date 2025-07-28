import { describe, it, expect, beforeAll } from 'vitest';

import {
  getAllPRListInPeriod,
  getUserPRActivityListInPeriod,
  getUserCreatedPRListInPeriod,
  getUserParticipatedPRListInPeriod,
} from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('getAllPRListInPeriod', () => {
  it('returns all pull requests within the specified period', async () => {
    const result = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-13', endDate: '2024-09-15' },
      targetBranch: '',
    });

    expect(result).toMatchSnapshot();
  });
});

describe('getUserPRActivityListInPeriod', () => {
  it('returns pull requests the user has participated in (via comments or reviews) within the specified period', async () => {
    const result = await getUserPRActivityListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-31' },
      targetBranch: 'master',
    });

    expect(result.created[0].author).toBe('oliviertassinari');
    result.participated.map((pr) => {
      const isParticipated =
        pr.commenters?.includes('oliviertassinari') || pr.reviewers?.includes('oliviertassinari');
      expect(isParticipated).toBe(true);
    });

    expect(result).toMatchSnapshot();
  });
});

describe('getUserCreatedPRListInPeriod', () => {
  it('returns an empty array when the user has no pull requests in the given period', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2015-01-01', endDate: '2015-01-10' },
      targetBranch: 'master',
    });

    expect(result).toEqual([]);
  });

  it('returns pull requests created by the user within the specified date range', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-15' },
      targetBranch: 'master',
    });

    expect(result).toMatchSnapshot();
  });

  it('filters pull requests that target a specific branch', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    expect(result).toMatchSnapshot();
  });
});

describe('getUserParticipatedPRListInPeriod', () => {
  it('returns pull requests the user has participated in (via comments or reviews) within the specified period', async () => {
    const result = await getUserParticipatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-31' },
      targetBranch: 'master',
    });

    result.map((pr) => {
      const isParticipated =
        pr.author !== 'oliviertassinari' &&
        (pr.commenters?.includes('oliviertassinari') || pr.reviewers?.includes('oliviertassinari'));
      expect(isParticipated).toBe(true);
    });

    expect(result).toMatchSnapshot();
  });
});
