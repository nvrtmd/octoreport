import { fetchAllPRListInPeriod } from '@/api';
import { filterPRListByTargetBranch, normalizePRData } from '@/core';
import { PR, PRQueryParams } from '@/types';

export async function getUserParticipatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  const participatedPRList = allPRList
    .filter(
      (pr) => pr.comments?.includes(options.username) || pr.reviewers.includes(options.username),
    )
    .map(normalizePRData);

  return participatedPRList;
}
