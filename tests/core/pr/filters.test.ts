import { describe, it, expect, beforeAll } from 'vitest';

import { fetchAllPRListInPeriod } from '@/api';
import {
  filterPRListByAuthor,
  filterPRListByCommenter,
  filterPRListByParticipation,
  filterPRListByTargetBranch,
  filterPRListByReviewer,
  filterPRListNotAuthoredByUser,
  filterPRListByLabel,
  getAllPRListInPeriod,
  getUserCreatedPRListInPeriod,
  filterCompletedReviewRequestPRList,
  filterPendingReviewRequestPRList,
  filterReviewedPRListWithoutBeingRequested,
} from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('filterPRListByAuthor', () => {
  it('filters pull requests that are authored by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-03' },
      targetBranch: '',
    });

    const result = filterPRListByAuthor(prList, 'oliviertassinari');

    expect(result.length).toBe(3);
    expect(result).toMatchSnapshot();
  });
});

describe('filterPRListNotAuthoredByUser', () => {
  it('filters pull requests that are not authored by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-03' },
      targetBranch: '',
    });

    const result = filterPRListNotAuthoredByUser(prList, 'oliviertassinari');

    expect(result.length).toBe(9);
    expect(result).toMatchSnapshot();
  });
});

describe('filterPRListByReviewer', () => {
  it('filters pull requests that have ever been reviewed by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-03' },
      targetBranch: '',
    });

    const result = filterPRListByReviewer(prList, 'alexfauquette');

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('[docs-infra] Update feedback Node.js to v22');
    expect(result).toMatchSnapshot();
  });
});

describe('filterPRListByCommenter', () => {
  it('filters pull requests that have ever been commented by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-03' },
      targetBranch: '',
    });

    const result = filterPRListByCommenter(prList, 'ZeeshanTamboli');

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('[docs][ToggleButtonGroup] Add spacing demo');
    expect(result).toMatchSnapshot();
  });
});

describe('filterPRListByParticipation', () => {
  it('filters pull requests that have ever been commented or reviewed by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-03' },
      targetBranch: '',
    });

    const result = filterPRListByParticipation(prList, 'ZeeshanTamboli');

    expect(result.length).toBe(2);
    expect(result[0].number).toBe(46056);
    expect(result[1].number).toBe(46058);
    expect(result).toMatchSnapshot();
  });
});

describe('filterPRListByTargetBranch', () => {
  it('filters pull requests that are targeting the specified branch', async () => {
    const allPRList = await fetchAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-13', endDate: '2024-09-14' },
    });
    const result = filterPRListByTargetBranch(allPRList, 'mui:v5.x');

    expect(result.length).toBe(2);
    expect(result[0].number).toBe(43753);
    expect(result[1].number).toBe(43755);
    expect(result).toMatchSnapshot();
  });
});

describe('filterPRListByLabel', () => {
  it('filters pull requests that exactly match provided label names (case-sensitive)', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-15' },
      targetBranch: 'master',
    });

    const result = filterPRListByLabel(prList, ['docs']);

    expect(result).toMatchSnapshot();
  });
  it('filters pull requests that include provided label keywords (case-insensitive, partial match)', async () => {
    const prList = await getUserCreatedPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      username: 'oliviertassinari',
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-10' },
      targetBranch: 'master',
    });

    const result = filterPRListByLabel(prList, ['regression']);

    expect(result.length).toBe(3);
    expect(result[0].labels).toContain('regression 🐛');
    expect(result[1].labels).toContain('regression 🐛');
    expect(result[2].labels).toContain('regression 🐛');
    expect(result).toMatchSnapshot();
  });
});

describe('filterCompletedReviewRequestPRList', () => {
  it('filters pull requests that have been completed review request by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: '',
    });

    const result = filterCompletedReviewRequestPRList(prList, 'ZeeshanTamboli');

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('[docs][material-ui][CircularProgress] Add Circular size demo');
    expect(result).toMatchSnapshot();
  });
});

describe('filterPendingReviewRequestPRList', () => {
  it('filters pull requests that have pending review request by the specified user', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: '',
    });

    const result = filterPendingReviewRequestPRList(prList, 'alelthomas');

    expect(result.length).toBe(2);
    expect(result[0].title).toBe('[docs][pigment-css] Fix typo globalCSS -> globalCss');
    expect(result[1].title).toBe('[examples] Fix v5 clone example instructions');
    expect(result).toMatchSnapshot();
  });
});

describe('filterReviewedPRListWithoutBeingRequested', () => {
  it('filters pull requests that have been reviewed by the specified user who have not been requested to review', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: '',
    });

    const result = filterReviewedPRListWithoutBeingRequested(prList, 'ZeeshanTamboli');

    expect(result.length).toBe(1);
    expect(result[0].title).toBe('[docs][pigment-css] Fix typo globalCSS -> globalCss');
    expect(result).toMatchSnapshot();
  });
});
