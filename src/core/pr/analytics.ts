import { hasUserParticipatedInPR, hasUserAuthoredPR } from './filters';

import { PR, PRDetail } from '@/types';

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
    if (hasUserAuthoredPR(pr, username)) {
      userCreatedPRList.push(pr);
    } else if (pr.reviewers?.includes(username) || pr.commenters?.includes(username)) {
      userParticipatedPRList.push(pr);
    }
  });

  return { userCreatedPRList, userParticipatedPRList };
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

export function getPRListByLabel(prList: PR[]): Record<string, PR[]> {
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

export function getUserCreationAndParticipationPRCountByDate(
  prList: PR[],
  username: string,
): Record<string, Record<'created' | 'participated', number>> {
  const prCountByDateMap: Record<string, Record<'created' | 'participated', number>> = {};
  prList.forEach((pr) => {
    const createdAt = pr.createdAt.split(' ')[0];
    if (hasUserAuthoredPR(pr, username)) {
      prCountByDateMap[createdAt] = {
        created: (prCountByDateMap[createdAt]?.created || 0) + 1,
        participated: prCountByDateMap[createdAt]?.participated || 0,
      };
    } else if (hasUserParticipatedInPR(pr, username)) {
      prCountByDateMap[createdAt] = {
        created: prCountByDateMap[createdAt]?.created || 0,
        participated: (prCountByDateMap[createdAt]?.participated || 0) + 1,
      };
    }
  });
  return prCountByDateMap;
}

export function getUserCreationAndParticipationPRListByDate(
  prList: PR[],
  username: string,
): Record<string, Record<'created' | 'participated', PR[]>> {
  const prListByDateMap: Record<string, Record<'created' | 'participated', PR[]>> = {};
  prList.forEach((pr) => {
    const createdAt = pr.createdAt.split(' ')[0];
    if (hasUserAuthoredPR(pr, username)) {
      prListByDateMap[createdAt] = {
        created: [...(prListByDateMap[createdAt]?.created || []), pr],
        participated: prListByDateMap[createdAt]?.participated || [],
      };
    } else if (hasUserParticipatedInPR(pr, username)) {
      prListByDateMap[createdAt] = {
        created: prListByDateMap[createdAt]?.created || [],
        participated: [...(prListByDateMap[createdAt]?.participated || []), pr],
      };
    }
  });
  return prListByDateMap;
}

export function getUserCreationCountByDate(prList: PR[], username: string): Record<string, number> {
  const creationCountByDateMap: Record<string, number> = {};
  prList.forEach((pr) => {
    const createdAt = pr.createdAt.split(' ')[0];
    if (hasUserAuthoredPR(pr, username)) {
      creationCountByDateMap[createdAt] = (creationCountByDateMap[createdAt] || 0) + 1;
    }
  });
  return creationCountByDateMap;
}

export function getUserCreationPRListByDate(prList: PR[], username: string): Record<string, PR[]> {
  const creationPRListByDateMap: Record<string, PR[]> = {};
  prList.forEach((pr) => {
    const createdAt = pr.createdAt.split(' ')[0];
    if (hasUserAuthoredPR(pr, username)) {
      creationPRListByDateMap[createdAt] = [...(creationPRListByDateMap[createdAt] || []), pr];
    }
  });
  return creationPRListByDateMap;
}

export function getUserParticipationCountByDate(
  prList: PR[],
  username: string,
): Record<string, number> {
  const participationCountByDateMap: Record<string, number> = {};
  prList.forEach((pr) => {
    const createdAt = pr.createdAt.split(' ')[0];
    if (hasUserParticipatedInPR(pr, username)) {
      participationCountByDateMap[createdAt] = (participationCountByDateMap[createdAt] || 0) + 1;
    }
  });
  return participationCountByDateMap;
}

export function getUserParticipationPRListByDate(
  prList: PR[],
  username: string,
): Record<string, PR[]> {
  const participationPRListByDateMap: Record<string, PR[]> = {};
  prList.forEach((pr) => {
    const createdAt = pr.createdAt.split(' ')[0];
    if (hasUserParticipatedInPR(pr, username)) {
      participationPRListByDateMap[createdAt] = [
        ...(participationPRListByDateMap[createdAt] || []),
        pr,
      ];
    }
  });
  return participationPRListByDateMap;
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

export function getPRStatusCount(prList: PR[]): PRStatistics['status'] {
  const statusCountMap: PRStatistics['status'] = {
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

export function getPRListByStatus(prList: PR[]): Record<PRDetail['state'], PR[]> {
  const prListByStatusMap: Record<PRDetail['state'], PR[]> = {
    OPEN: [],
    CLOSED: [],
    MERGED: [],
  };
  prList.forEach((pr) => {
    if (pr.state) {
      prListByStatusMap[pr.state] = [...(prListByStatusMap[pr.state] || []), pr];
    }
  });
  return prListByStatusMap;
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
      status: getPRStatusCount(userCreatedPRList),
    },
    userParticipatedPR: {
      count: userParticipatedPRList.length,
      ratio: getUserParticipatedPRRatio(prList, username),
      countByLabel: getPRCountByLabel(userParticipatedPRList),
      status: getPRStatusCount(userParticipatedPRList),
    },
  };
}
