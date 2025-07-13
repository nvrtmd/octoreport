import { describe, expect, it } from 'vitest';

import { getGithubToken } from '../../src/auth/token';
import { getUserInfo } from '../../src/auth/userInfo';
import {
  getUserCreatedPRCountInPeriod,
  getUserCreatedPRListInPeriod,
  getUserCreatedPRListInPeriodByLabel,
  getUserPRCountByLabelInPeriod,
  getUserParticipatedPRListInPeriod,
  getUserPRListByCreationAndParticipation,
} from '../../src/core';

const { email: githubEmail } = getUserInfo();
const githubToken = await getGithubToken(githubEmail);

describe('getUserPRListByCreationAndParticipation', () => {
  it('returns pull requests the user has participated in (via comments or reviews) within the specified period', async () => {
    const result = await getUserPRListByCreationAndParticipation({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-31' },
      targetBranch: 'master',
    });

    expect(result.userCreatedPRList[0].author).toBe('oliviertassinari');
    result.userParticipatedPRList.map((pr) => {
      const isParticipated =
        pr.comments?.includes('oliviertassinari') || pr.reviewers.includes('oliviertassinari');
      expect(isParticipated).toBe(true);
    });

    expect(result).toMatchSnapshot();
  });
});

describe('getUserCreatedPRListInPeriod', () => {
  it('returns an empty array when the user has no pull requests in the given period', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2015-01-01', endDate: '2015-01-10' },
      targetBranch: 'master',
    });

    expect(result).toEqual([]);
  });

  it('returns pull requests created by the user within the specified date range', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-31' },
      targetBranch: 'master',
    });

    expect(result).toMatchSnapshot();
  });

  it('filters pull requests that target a specific branch', async () => {
    const result = await getUserCreatedPRListInPeriod({
      githubToken,
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
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-31' },
      targetBranch: 'master',
    });

    result.map((pr) => {
      const isParticipated =
        pr.comments?.includes('oliviertassinari') || pr.reviewers.includes('oliviertassinari');
      expect(isParticipated).toBe(true);
    });

    expect(result).toMatchSnapshot();
  });
});

describe('getUserCreatedPRCountInPeriod', () => {
  it('returns the number of pull requests created by the user within the specified period', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = await getUserCreatedPRCountInPeriod(prList);

    expect(result).toEqual(2);
  });
});

describe('getUserCreatedPRListInPeriodByLabel', () => {
  it('filters pull requests that exactly match provided label names (case-sensitive)', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-31' },
      targetBranch: 'master',
    });

    const result = await getUserCreatedPRListInPeriodByLabel(prList, ['docs']);

    expect(result).toMatchSnapshot();
  });
  it('filters pull requests that include provided label keywords (case-insensitive, partial match)', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-10' },
      targetBranch: 'master',
    });

    const result = await getUserCreatedPRListInPeriodByLabel(prList, ['regression']);

    expect(result.length).toBe(3);
    expect(result[0].labels).toContain('regression 🐛');
    expect(result[1].labels).toContain('regression 🐛');
    expect(result[2].labels).toContain('regression 🐛');
    expect(result).toMatchSnapshot();
  });
});

describe('getUserPRCountByLabelInPeriod', () => {
  it('counts pull requests created by the user within the specified period, grouped by label, and returns an object like {feat: 10, fix: 2, test: 10, ...}', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken,
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = await getUserPRCountByLabelInPeriod(prList);

    expect(result).toEqual({
      docs: 1,
      'regression 🐛': 1,
      'v5.x': 2,
      'bug 🐛': 1,
      examples: 1,
    });
  });
});
