import { describe, it, expect, beforeAll } from 'vitest';

import {
  getAllPRListInPeriod,
  getUserCreatedPRListInPeriod,
  groupPRListByUserRole,
  groupPRListByLabel,
  groupPRListByDateAndRole,
  groupUserCreatedPRListByDate,
  groupUserParticipatedPRListByDate,
  groupPRListByReviewStatus,
  groupPRListByStatus,
} from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('groupPRListByUserRole', () => {
  it('separates PR list into created and participated PRs for a specific user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = groupPRListByUserRole(prList, 'oliviertassinari');

    expect(result).toMatchSnapshot();
  });
});

describe('groupPRListByLabel', () => {
  it('returns the pull requests grouped by label', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-05' },
      targetBranch: 'master',
    });

    const result = groupPRListByLabel(prList);

    expect(result).toMatchSnapshot();
  });
});

describe('groupPRListByStatus', () => {
  it('returns the status count of pull requests in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = groupPRListByStatus(prList);
    expect(result).toMatchSnapshot();
    expect(result.OPEN.length).toBe(0);
    expect(result.CLOSED.length).toBe(8);
    expect(result.MERGED.length).toBe(22);
  });
});

describe('groupPRListByDateAndRole', () => {
  it('returns the list of pull requests the user has created and participated in within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = groupPRListByDateAndRole(prList, 'oliviertassinari');

    expect(result).toMatchSnapshot();
    expect(result['2019-08-20'].created.length).toBe(5);
    expect(result['2019-08-20'].participated.length).toBe(1);
    expect(result['2019-08-21'].created.length).toBe(1);
    expect(result['2019-08-21'].participated.length).toBe(4);
    expect(result['2019-08-22'].created.length).toBe(0);
    expect(result['2019-08-22'].participated.length).toBe(6);
    expect(result['2019-08-23'].created.length).toBe(0);
    expect(result['2019-08-23'].participated.length).toBe(7);
  });
});

describe('groupUserCreatedPRListByDate', () => {
  it('returns the list of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = groupUserCreatedPRListByDate(prList, 'oliviertassinari');

    expect(result).toMatchSnapshot();
    expect(result['2019-08-20'].length).toBe(5);
    expect(result['2019-08-21'].length).toBe(1);
  });
});

describe('groupUserParticipatedPRListByDate', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = groupUserParticipatedPRListByDate(prList, 'oliviertassinari');

    expect(result).toMatchSnapshot();
    expect(result['2019-08-20'].length).toBe(1);
    expect(result['2019-08-21'].length).toBe(4);
    expect(result['2019-08-22'].length).toBe(6);
    expect(result['2019-08-23'].length).toBe(7);
  });
});

describe('groupPRListByReviewStatus', () => {
  it('returns the PRs grouped by review status', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = groupPRListByReviewStatus(prList, 'Janpot');
    expect(result).toMatchSnapshot();
    expect(result.reviewedByRequest.length).toBe(2);
    expect(result.pendingReviewRequest.length).toBe(1);
    expect(result.selfInitiatedReviewed.length).toBe(3);
    expect(result.uninvolvedInReview.length).toBe(15);
  });
});
