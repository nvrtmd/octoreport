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
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  const { createdPRList, participatedPRList } = separatePRListByUserParticipation(
    allPRList,
    options.username,
  );

  return { userCreatedPRList: createdPRList, userParticipatedPRList: participatedPRList };
}

export async function getUserCreatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  return filterPRListByAuthor(allPRList, options.username).map(normalizePRData);
}

export async function getUserParticipatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  const participatedPRList = filterPRListByParticipation(allPRList, options.username).map(
    normalizePRData,
  );

  return participatedPRList;
}
