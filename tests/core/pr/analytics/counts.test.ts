import { describe, it, expect, beforeAll } from 'vitest';

import {
  getAllPRListInPeriod,
  getUserCreatedPRListInPeriod,
  countTotalPRList,
  countPRListByLabel,
  countUserPRListByDateAndRole,
  countUserCreatedPRListByDate,
  countUserParticipatedPRListByDate,
  countPRListByStatus,
  countTotalReviewRequestsForUser,
  countReviewRequestsCompletedByUser,
  countReviewRequestsPendingByUser,
  countSelfInitiatedReviewedPRListByUser,
  countPRListReviewedByUser,
  countPRListCommentedByUser,
  countPRListParticipatedByUser,
} from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('countTotalPRList', () => {
  it('returns the number of pull requests in the given period', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = countTotalPRList(prList);

    expect(result).toEqual(2);
  });
});

describe('countPRListByLabel', () => {
  it('counts pull requests created by the user within the specified period, grouped by label, and returns an object like {feat: 10, fix: 2, test: 10, ...}', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-10', endDate: '2024-09-20' },
      targetBranch: 'mui:v5.x',
    });

    const result = countPRListByLabel(prList);

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

    const result = countPRListByLabel(prList);

    expect(result).toEqual({
      'N/A': 1,
    });
  });
});

describe('countUserPRListByDateAndRole', () => {
  it('returns the activity of pull requests in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = countUserPRListByDateAndRole(prList, 'oliviertassinari');
    expect(result).toEqual({
      '2019-08-20': { created: 5, participated: 1 },
      '2019-08-21': { created: 1, participated: 4 },
      '2019-08-22': { created: 0, participated: 6 },
      '2019-08-23': { created: 0, participated: 7 },
    });
  });
});

describe('countUserCreatedPRListByDate', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = countUserCreatedPRListByDate(prList, 'oliviertassinari');

    expect(result).toEqual({
      '2019-08-20': 5,
      '2019-08-21': 1,
    });
  });
});

describe('countUserParticipatedPRListByDate', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = countUserParticipatedPRListByDate(prList, 'oliviertassinari');

    expect(result).toEqual({
      '2019-08-20': 1,
      '2019-08-21': 4,
      '2019-08-22': 6,
      '2019-08-23': 7,
    });
  });
});

describe('countPRListByStatus', () => {
  it('returns the status count of pull requests in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = countPRListByStatus(prList);
    expect(result).toEqual({
      OPEN: 0,
      CLOSED: 8,
      MERGED: 22,
    });
  });
});

describe('countTotalReviewRequestsForUser', () => {
  it('returns the total number of review requests for the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countTotalReviewRequestsForUser(prList, 'siriwatknp');
    expect(result).toBe(7);
  });
});

describe('countReviewRequestsCompletedByUser', () => {
  it('returns the total number of review requests completed by the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countReviewRequestsCompletedByUser(prList, 'siriwatknp');
    expect(result).toBe(4);
  });
});

describe('countReviewRequestsPendingByUser', () => {
  it('returns the total number of review requests pending by the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countReviewRequestsPendingByUser(prList, 'siriwatknp');
    expect(result).toBe(3);
  });
});

describe('countSelfInitiatedReviewedPRListByUser', () => {
  it('returns the total number of self-initiated reviews by the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countSelfInitiatedReviewedPRListByUser(prList, 'Janpot');
    expect(result).toBe(3);
  });
});

describe('countPRListReviewedByUser', () => {
  it('returns the total number of PRs reviewed by the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countPRListReviewedByUser(prList, 'Janpot');
    expect(result).toBe(5);
  });
});

describe('countPRListCommentedByUser', () => {
  it('returns the total number of PRs commented by the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countPRListCommentedByUser(prList, 'Janpot');
    expect(result).toBe(3);
  });
});

describe('countPRListParticipatedByUser', () => {
  it('returns the total number of PRs participated by the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = countPRListParticipatedByUser(prList, 'Janpot');
    expect(result).toBe(5);
  });
});
