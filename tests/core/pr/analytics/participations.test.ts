import { describe, it, expect, beforeAll } from 'vitest';

import { getAllPRListInPeriod, getFirstParticipationTime } from '@/core';
import { normalizeParticipation } from '@/core/pr';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('getFirstParticipationTime', () => {
  it('returns the first participation time of the user in the given period', async () => {
    const prList = await getAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-12', endDate: '2024-09-14' },
      targetBranch: 'master',
    });

    const result = getFirstParticipationTime(normalizeParticipation(prList[0]), 'Janpot');
    expect(result).toBe('2024-09-16T07:46:53Z');
  });
});
