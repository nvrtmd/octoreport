import { describe, it } from 'vitest';

import { fetchAllPRListInPeriod } from '@/api/github';
import { getFirstParticipationTime } from '@/core/pr/analytics';

describe('test', () => {
  it('test', async () => {
    const allPRList = await fetchAllPRListInPeriod({
      githubToken: process.env.GITHUB_TOKEN || '',
      repository: 'mui/material-ui',
      period: { startDate: '2024-09-13', endDate: '2024-09-14' },
    });
    allPRList.forEach((pr) => {
      console.log('REVIEW', pr.reviews);
      console.log('COMMENT', pr.comments);
      console.log(
        'FIRST PARTICIPATION TIME',
        getFirstParticipationTime([...(pr.reviews || []), ...(pr.comments || [])], 'Janpot'),
      );
    });
  });
});
