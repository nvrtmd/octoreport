import { describe, expect, it } from 'vitest';

import { fetchPRDetail, fetchPRListInPeriod } from '../../src/api';
import { getGithubToken } from '../../src/auth/token';

const githubToken = await getGithubToken();

describe('fetchPRListInPeriod', () => {
  it('returns every pull request in the given repository and period', async () => {
    const result = await fetchPRListInPeriod({
      githubToken,
      repository: 'mui/material-ui',
      period: { startDate: '2025-05-01', endDate: '2025-05-31' },
    });

    expect(result).toMatchSnapshot();
  });
});

describe('fetchPRDetail', () => {
  it('returns every pull request detail in the given repository and period', async () => {
    const result = await fetchPRDetail({
      githubToken,
      repository: 'mui/material-ui',
      prNumber: 374,
    });

    expect(result).toMatchSnapshot();
  });
});
