import { PR } from '@/types';

export function getPRCount(prList: PR[]): number {
  return prList.length;
}

export function getPRCountByLabel(prList: PR[]): Record<string, number> {
  const labelCountMap: Record<string, number> = {};
  prList.forEach((pr) => {
    if (pr.labels.length === 0) {
      labelCountMap['N/A'] = (labelCountMap['N/A'] || 0) + 1;
      return;
    }
    pr.labels.forEach((label) => {
      labelCountMap[label] = (labelCountMap[label] || 0) + 1;
    });
  });
  return labelCountMap;
}

export function separatePRListByUserParticipation(
  prList: PR[],
  username: string,
): {
  createdPRList: PR[];
  participatedPRList: PR[];
} {
  const createdPRList: PR[] = [];
  const participatedPRList: PR[] = [];

  prList.forEach((pr) => {
    if (pr.author === username) {
      createdPRList.push(pr);
    } else if (pr.reviewers.includes(username) || pr.commenters?.includes(username)) {
      participatedPRList.push(pr);
    }
  });

  return { createdPRList, participatedPRList };
}
