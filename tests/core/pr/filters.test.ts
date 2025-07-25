import { describe, it, expect, beforeAll } from 'vitest';

import { filterPRListByLabel } from '@/core';
import { getUserCreatedPRListInPeriod } from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
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
