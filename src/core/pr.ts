import { fetchAllPRListInPeriod } from '../api';
import { ActivityQueryOptions, PR } from '../types';

export async function getUserCreatedPRListInPeriod(options: ActivityQueryOptions): Promise<PR[]> {
  const prList = await fetchAllPRListInPeriod(options);

  return prList.filter((pr) => pr.author === options.username);
}

export async function getUserCreatedPRListInPeriodByLabel(
  options: ActivityQueryOptions,
): Promise<PR[]> {
  const prList = await fetchAllPRListInPeriod(options);

  return prList.filter(
    (pr) =>
      pr.author === options.username &&
      options.labelFilter?.some((filter) =>
        pr.labels.some((label) => label.toLowerCase().includes(filter.toLowerCase())),
      ),
  );
}
