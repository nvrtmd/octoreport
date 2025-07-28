import { fetchAllPRListInPeriod } from '@/api';
import {
  filterPRListByAuthor,
  filterPRListByTargetBranch,
  filterPRListByParticipation,
  normalizePRData,
  groupPRListByUserRole,
} from '@/core';
import { PR, PRQueryParams } from '@/types';

export async function getAllPRListInPeriod(
  options: Pick<PRQueryParams, 'repository' | 'period' | 'githubToken' | 'targetBranch'>,
): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  return allPRList.map(normalizePRData);
}

export async function getUserPRActivityListInPeriod(
  options: PRQueryParams,
): Promise<{ created: PR[]; participated: PR[] }> {
  const allPRList = await getAllPRListInPeriod(options);

  const { created, participated } = groupPRListByUserRole(allPRList, options.username);

  return { created, participated };
}

export async function getUserCreatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  const allPRList = await getAllPRListInPeriod(options);

  return filterPRListByAuthor(allPRList, options.username);
}

export async function getUserParticipatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  const allPRList = await getAllPRListInPeriod(options);

  const participatedPRList = filterPRListByParticipation(allPRList, options.username);

  return participatedPRList;
}
