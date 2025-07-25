import { PR, PRDetail } from '@/types';

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

export function getPRStatus(prList: PR[]): Record<string, number> {
  const statusCountMap: Record<PRDetail['state'], number> = {
    OPEN: 0,
    CLOSED: 0,
    MERGED: 0,
  };
  prList.forEach((pr) => {
    if (pr.state) {
      statusCountMap[pr.state] = (statusCountMap[pr.state] || 0) + 1;
    }
  });
  return statusCountMap;
}

interface PRStatistics {
  count: number;
  ratio: number;
  countByLabel: Record<string, number>;
  status: Record<PRDetail['state'], number>;
}

interface UserPRStatistics {
  totalPRCount: number;
  userCreatedPR: PRStatistics;
  userParticipatedPR: PRStatistics;
}

export function getUserPRStatistics(prList: PR[], username: string): UserPRStatistics {
  const { userCreatedPRList, userParticipatedPRList } = separatePRListByUserParticipation(
    prList,
    username,
  );
  return {
    totalPRCount: prList.length,
    userCreatedPR: {
      count: userCreatedPRList.length,
      ratio: getUserCreatedPRRatio(prList, username),
      countByLabel: getPRCountByLabel(userCreatedPRList),
      status: getPRStatus(userCreatedPRList),
    },
    userParticipatedPR: {
      count: userParticipatedPRList.length,
      ratio: getUserParticipatedPRRatio(prList, username),
      countByLabel: getPRCountByLabel(userParticipatedPRList),
      status: getPRStatus(userParticipatedPRList),
    },
  };
}
