import { PR } from '@/types';

export function groupPRListByLabel(prList: PR[]): Record<string, PR[]> {
  const prListByLabelMap: Record<string, PR[]> = {};
  prList.forEach((pr) => {
    if (!pr.labels) {
      prListByLabelMap['N/A'] = [pr];
      return;
    }
    pr.labels.forEach((label) => {
      prListByLabelMap[label] = [...(prListByLabelMap[label] || []), pr];
    });
  });
  return prListByLabelMap;
}

export function getPRCount(prList: PR[]): number {
  return prList.length;
}

export function getPRCountByLabel(prList: PR[]): Record<string, number> {
  const labelCountMap: Record<string, number> = {};
  prList.forEach((pr) => {
    if (!pr.labels) {
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
  userCreatedPRList: PR[];
  userParticipatedPRList: PR[];
} {
  const userCreatedPRList: PR[] = [];
  const userParticipatedPRList: PR[] = [];

  prList.forEach((pr) => {
    if (pr.author === username) {
      userCreatedPRList.push(pr);
    } else if (pr.reviewers?.includes(username) || pr.commenters?.includes(username)) {
      userParticipatedPRList.push(pr);
    }
  });

  return { userCreatedPRList, userParticipatedPRList };
}

export function getUserCreatedPRRatio(prList: PR[], username: string): number {
  const { userCreatedPRList } = separatePRListByUserParticipation(prList, username);
  const userCreatedPRCount = userCreatedPRList.length;
  const totalPRCount = prList.length;
  return totalPRCount > 0 ? userCreatedPRCount / totalPRCount : 0;
}

export function getUserParticipatedPRRatio(prList: PR[], username: string): number {
  const { userParticipatedPRList } = separatePRListByUserParticipation(prList, username);
  const userParticipatedPRCount = userParticipatedPRList.length;
  const totalPRCount = prList.length;
  return totalPRCount > 0 ? userParticipatedPRCount / totalPRCount : 0;
}
