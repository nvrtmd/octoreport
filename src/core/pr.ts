import { fetchAllPRListInPeriod } from '../api';
import { PRQueryParams, PR } from '../types';

export function uniqueArray<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function filterPRListByTargetBranch(prList: PR[], targetBranch: string): PR[] {
  const parsedTargetBranch = targetBranch.includes(':') ? targetBranch.split(':')[1] : targetBranch;
  return prList.filter((pr) => pr.targetBranch === parsedTargetBranch);
}

async function getPRListByTargetBranch(options: PRQueryParams): Promise<PR[]> {
  const prList = await fetchAllPRListInPeriod(options);
  return filterPRListByTargetBranch(prList, options.targetBranch);
}

export async function getUserPRListByCreationAndParticipation(
  options: PRQueryParams,
): Promise<{ userCreatedPRList: PR[]; userParticipatedPRList: PR[] }> {
  const allPRList = await getPRListByTargetBranch(options);

  const createdPRList: PR[] = [];
  const participatedPRList: PR[] = [];

  allPRList.forEach((pr) => {
    if (pr.author === options.username) {
      createdPRList.push({
        ...pr,
        comments: uniqueArray(pr.comments ?? []),
        reviewers: uniqueArray(pr.reviewers),
      });
    } else if (pr.comments?.includes(options.username) || pr.reviewers.includes(options.username)) {
      participatedPRList.push({
        ...pr,
        comments: uniqueArray(pr.comments ?? []),
        reviewers: uniqueArray(pr.reviewers),
      });
    }
  });

  return { userCreatedPRList: createdPRList, userParticipatedPRList: participatedPRList };
}

export async function getUserCreatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  const allPRList = await getPRListByTargetBranch(options);

  return allPRList
    .filter((pr) => pr.author === options.username)
    .map((pr) => ({
      ...pr,
      comments: uniqueArray(pr.comments ?? []),
      reviewers: uniqueArray(pr.reviewers),
    }));
}

export async function getUserParticipatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  const allPRList = await getPRListByTargetBranch(options);

  const participatedPRList = allPRList
    .filter(
      (pr) => pr.comments?.includes(options.username) || pr.reviewers.includes(options.username),
    )
    .map((pr) => ({
      ...pr,
      comments: uniqueArray(pr.comments ?? []),
      reviewers: uniqueArray(pr.reviewers),
    }));

  return participatedPRList;
}

export async function getUserCreatedPRCountInPeriod(prList: PR[]): Promise<number> {
  return prList.length;
}

export async function getUserCreatedPRListInPeriodByLabel(
  prList: PR[],
  labelFilter: string[],
): Promise<PR[]> {
  return prList.filter((pr) =>
    labelFilter.some((filter) =>
      pr.labels.some((label) => label.toLowerCase().includes(filter.toLowerCase())),
    ),
  );
}

export async function getUserPRCountByLabelInPeriod(prList: PR[]): Promise<Record<string, number>> {
  const labelCountMap: Record<string, number> = {};
  prList.map((pr) => {
    pr.labels.forEach((label) => {
      labelCountMap[label] = (labelCountMap[label] || 0) + 1;
    });
  });
  return labelCountMap;
}
