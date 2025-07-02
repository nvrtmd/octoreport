import { fetchAllPRListInPeriod } from "../api";
import { ActivityQueryOptions, PR } from "../types";

export async function getUserCreatedPRListInPeriod(
  options: ActivityQueryOptions
): Promise<PR[]> {
  const prList = await fetchAllPRListInPeriod(options);

  return prList.filter((pr) => pr.author === options.username);
}
