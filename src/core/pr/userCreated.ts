import { fetchAllPRListInPeriod } from '../../api';
import { PRQueryParams, PR } from '../../types';

import { normalizePRData } from './common';
import { filterPRListByTargetBranch } from './filters';

export async function getUserCreatedPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  return allPRList.filter((pr) => pr.author === options.username).map(normalizePRData);
}

export function getUserCreatedPRCountInPeriod(prList: PR[]): number {
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

export function getUserPRCountByLabelInPeriod(prList: PR[]): Record<string, number> {
  const labelCountMap: Record<string, number> = {};
  prList.forEach((pr) => {
    pr.labels.forEach((label) => {
      labelCountMap[label] = (labelCountMap[label] || 0) + 1;
    });
  });
  return labelCountMap;
}
