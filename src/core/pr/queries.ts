import { fetchAllPRListInPeriod } from '@/api';
import {
  filterPRListByAuthor,
  filterPRListByTargetBranch,
  filterPRListByParticipation,
  normalizePRData,
  separatePRListByUserParticipation,
} from '@/core';
import { PR, PRQueryParams } from '@/types';

export async function getAllPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  return allPRList.map(normalizePRData);
}

export async function getUserPRListByCreationAndParticipation(
  options: PRQueryParams,
): Promise<{ userCreatedPRList: PR[]; userParticipatedPRList: PR[] }> {
  const allPRList = await getAllPRListInPeriod(options);

  const { userCreatedPRList, userParticipatedPRList } = separatePRListByUserParticipation(
    allPRList,
    options.username,
  );

  return { userCreatedPRList, userParticipatedPRList };
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
