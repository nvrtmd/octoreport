import { fetchAllPRListInPeriod } from '@/api';
import { filterPRListByTargetBranch, normalizePRData } from '@/core';
import { PR, PRQueryParams } from '@/types';

export async function getAllPRListInPeriod(options: PRQueryParams): Promise<PR[]> {
  let allPRList = await fetchAllPRListInPeriod(options);
  if (options.targetBranch) {
    allPRList = filterPRListByTargetBranch(allPRList, options.targetBranch);
  }

  return allPRList.map(normalizePRData);
}

export function getAllPRCountInPeriod(prList: PR[]): number {
  return prList.length;
}

export function getPRCountByLabelInPeriod(prList: PR[]): Record<string, number> {
  const labelCountMap: Record<string, number> = { 'N/A': 0 };
  prList.forEach((pr) => {
    if (pr.labels.length === 0) {
      if (labelCountMap['N/A']) {
        labelCountMap['N/A'] = labelCountMap['N/A'] + 1;
      } else {
        labelCountMap['N/A'] = 1;
      }
      return;
    }
    pr.labels.forEach((label) => {
      if (labelCountMap[label]) {
        labelCountMap[label] = labelCountMap[label] + 1;
      } else {
        labelCountMap[label] = 1;
      }
    });
  });
  return labelCountMap;
}
