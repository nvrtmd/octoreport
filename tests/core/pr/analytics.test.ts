import { describe, it, expect, beforeAll } from 'vitest';

import {
  getAllPRListInPeriod,
  getUserCreatedPRListInPeriod,
  countTotalPRList,
  countPRListByLabel,
  groupPRListByUserRole,
  calculateUserCreatedPRRatio,
  groupPRListByLabel,
  calculateUserParticipatedPRRatio,
  countPRListByStatus,
  calculateUserPRStatistics,
  countUserPRListByDateAndRole,
  groupPRListByDateAndRole,
  countUserCreatedPRByDate,
  groupUserCreatedPRListByDate,
  countUserParticipatedPRByDate,
  groupUserParticipatedPRListByDate,
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

describe('getPRCountByLabel', () => {
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

describe('getPRListByLabel', () => {
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

describe('countUserCreatedPRByDate', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = countUserCreatedPRByDate(prList, 'oliviertassinari');

    expect(result).toEqual({
      '2019-08-20': 5,
      '2019-08-21': 1,
    });
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

describe('countUserParticipatedPRByDate', () => {
  it('returns the ratio of pull requests the user has created within the specified period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2019-08-20', endDate: '2019-08-23' },
      targetBranch: 'master',
    });

    const result = countUserParticipatedPRByDate(prList, 'oliviertassinari');

    expect(result).toEqual({
      '2019-08-20': 1,
      '2019-08-21': 4,
      '2019-08-22': 6,
      '2019-08-23': 7,
    });
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
