import { fetchAllPRListInPeriod } from '../api';
import { ActivityQueryOptions, PR } from '../types';

export async function getUserCreatedPRListInPeriod(options: ActivityQueryOptions): Promise<PR[]> {
  const userCreatedPRList = await fetchAllPRListInPeriod(options);

  return userCreatedPRList.filter((pr) => pr.author === options.username);
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
