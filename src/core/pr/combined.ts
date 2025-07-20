import { fetchAllPRListInPeriod } from '@/api';
import { filterPRListByTargetBranch, normalizePRData } from '@/core';
import { PR, PRQueryParams } from '@/types';

export async function getUserPRListByCreationAndParticipation(
  options: PRQueryParams,
): Promise<{ userCreatedPRList: PR[]; userParticipatedPRList: PR[] }> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  const createdPRList: PR[] = [];
  const participatedPRList: PR[] = [];

  allPRList.forEach((pr) => {
    if (pr.author === options.username) {
      createdPRList.push(normalizePRData(pr));
    } else if (pr.comments?.includes(options.username) || pr.reviewers.includes(options.username)) {
      participatedPRList.push(normalizePRData(pr));
    }
  });

  return { userCreatedPRList: createdPRList, userParticipatedPRList: participatedPRList };
}
