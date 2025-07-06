import { fetchAllPRListInPeriod } from '../api';
import { ActivityQueryOptions, PR } from '../types';

export async function getUserCreatedPRListInPeriod(options: ActivityQueryOptions): Promise<PR[]> {
  const userCreatedPRList = await fetchAllPRListInPeriod(options);

  return userCreatedPRList.filter((pr) => pr.author === options.username);
}

export async function getUserCreatedPRListInPeriodByLabel(
  options: ActivityQueryOptions,
): Promise<PR[]> {
  const userCreatedPRList = await getUserCreatedPRListInPeriod(options);

  return userCreatedPRList.filter((pr) =>
    options.labelFilter?.some((filter) =>
      pr.labels.some((label) => label.toLowerCase().includes(filter.toLowerCase())),
    ),
  );
}

export async function getUserPRCountByLabelInPeriod(
  options: ActivityQueryOptions,
): Promise<Record<string, number>> {
  const userCreatedPRList = await getUserCreatedPRListInPeriod(options);

  const labelCountMap: Record<string, number> = {};
  userCreatedPRList.map((pr) => {
    pr.labels.forEach((label) => {
      labelCountMap[label] = (labelCountMap[label] || 0) + 1;
    });
  });
  return labelCountMap;
}
