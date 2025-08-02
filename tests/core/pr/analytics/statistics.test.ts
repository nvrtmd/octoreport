import { describe, it, expect, beforeAll } from 'vitest';

import { getAllPRListInPeriod } from '@/core';
import {
  calculateUserCreatedPRRatio,
  calculateUserParticipatedPRRatio,
  calculateUserPRStatistics,
  calculateUserReviewStatistics,
} from '@/core/pr/analytics';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('calculateUserCreatedPRRatio', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = calculateUserCreatedPRRatio(prList, 'oliviertassinari');

    expect(result).toEqual(6 / 30);
  });
});

describe('calculateUserParticipatedPRRatio', () => {
  it('returns the ratio of pull requests the user has participated in within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });
    const result = calculateUserParticipatedPRRatio(prList, 'oliviertassinari');
    expect(result).toEqual(18 / 30);
  });
});

describe('calculateUserPRStatistics', () => {
  it('returns the statistics of pull requests in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = calculateUserPRStatistics(prList, 'oliviertassinari');
    expect(prList).toMatchSnapshot();

    expect(result).toHaveProperty('totalPRListCount');
    expect(result).toHaveProperty('created');
    expect(result).toHaveProperty('participated');

    expect(result.totalPRListCount).toBe(30);

    expect(result.created.count).toBe(6);
    expect(result.created.ratio).toBe(6 / 30);
    expect(result.created.status.OPEN).toBe(0);
    expect(result.created.status.CLOSED).toBe(0);
    expect(result.created.status.MERGED).toBe(6);

    expect(result.created.countByLabel['component: modal']).toBe(1);
    expect(result.created.countByLabel.docs).toBe(3);
    expect(result.created.countByLabel['component: tree view']).toBe(1);
    expect(result.created.countByLabel['new feature']).toBe(2);
    expect(result.created.countByLabel['component: app bar']).toBe(1);
    expect(result.created.countByLabel['component: divider']).toBe(1);
    expect(result.created.countByLabel.core).toBe(1);

    expect(result.participated.count).toBe(18);
    expect(result.participated.ratio).toBe(18 / 30);
    expect(result.participated.status.OPEN).toBe(0);
    expect(result.participated.status.CLOSED).toBe(2);
    expect(result.participated.status.MERGED).toBe(16);

    expect(result.participated.countByLabel.docs).toBe(8);
    expect(result.participated.countByLabel['bug 🐛']).toBe(5);
    expect(result.participated.countByLabel['component: drawer']).toBe(2);
    expect(result.participated.countByLabel['new feature']).toBe(2);
  });
});

describe('calculateUserReviewStatistics', () => {
  it('returns the review statistics of the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = calculateUserReviewStatistics(prList, 'Janpot');
    expect(result).toMatchSnapshot();
    expect(result.reviewedByRequest.count).toBe(2);
    expect(result.reviewedByRequest.ratioToTotal).toBe(2 / 26);
    expect(result.reviewedByRequest.ratioToRequested).toBe(2 / 3);
    expect(result.pendingReviewRequest.count).toBe(1);
    expect(result.pendingReviewRequest.ratioToTotal).toBe(1 / 26);
    expect(result.pendingReviewRequest.ratioToRequested).toBe(1 / 3);
    expect(result.selfInitiatedReviewed.count).toBe(3);
    expect(result.selfInitiatedReviewed.ratioToTotal).toBe(3 / 26);
    expect(result.selfInitiatedReviewed.ratioToRequested).toBeNull();
    expect(result.uninvolvedInReview.count).toBe(15);
    expect(result.uninvolvedInReview.ratioToTotal).toBe(15 / 26);
    expect(result.uninvolvedInReview.ratioToRequested).toBeNull();
  });
});
