import { describe, it, expect, beforeAll } from 'vitest';

import { getUserPRListByCreationAndParticipation } from '@/core';

beforeAll(() => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN environment variable is not set. Some tests may be skipped.');
  }
});

describe('getUserPRListByCreationAndParticipation', () => {
  it('returns pull requests the user has participated in (via comments or reviews) within the specified period', async () => {
    const result = await getUserPRListByCreationAndParticipation({
      githubToken: process.env.GITHUB_TOKEN || '',
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
