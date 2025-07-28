import { hasUserParticipatedInPR, hasUserAuthoredPR } from './filters';

import { PR, PRDetail } from '@/types';

export function countTotalPRList(prList: PR[]): number {
  return prList.length;
}

export function groupPRListByUserRole(
  prList: PR[],
  username: string,
): {
  created: PR[];
  participated: PR[];
} {
  const created: PR[] = [];
  const participated: PR[] = [];

  prList.forEach((pr) => {
    if (hasUserAuthoredPR(pr, username)) {
      created.push(pr);
    } else if (pr.reviewers?.includes(username) || pr.commenters?.includes(username)) {
      participated.push(pr);
    }
  });

  return { created, participated };
}

export function countPRListByLabel(prList: PR[]): Record<string, number> {
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

export function countUserPRListByDateAndRole(
  prList: PR[],
  username: string,
): Record<string, Record<'created' | 'participated', number>> {
  const prCountByDateMap: Record<string, Record<'created' | 'participated', number>> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
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

export function groupPRListByDateAndRole(
  prList: PR[],
  username: string,
): Record<string, Record<'created' | 'participated', PR[]>> {
  const prListByDateMap: Record<string, Record<'created' | 'participated', PR[]>> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
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

export function countUserCreatedPRByDate(prList: PR[], username: string): Record<string, number> {
  const creationCountByDateMap: Record<string, number> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
    if (hasUserAuthoredPR(pr, username)) {
      creationCountByDateMap[createdAt] = (creationCountByDateMap[createdAt] || 0) + 1;
    }
  });
  return creationCountByDateMap;
}

export function groupUserCreatedPRListByDate(prList: PR[], username: string): Record<string, PR[]> {
  const creationPRListByDateMap: Record<string, PR[]> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
    if (hasUserAuthoredPR(pr, username)) {
      creationPRListByDateMap[createdAt] = [...(creationPRListByDateMap[createdAt] || []), pr];
    }
  });
  return creationPRListByDateMap;
}

export function countUserParticipatedPRByDate(
  prList: PR[],
  username: string,
): Record<string, number> {
  const participationCountByDateMap: Record<string, number> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
    if (hasUserParticipatedInPR(pr, username)) {
      participationCountByDateMap[createdAt] = (participationCountByDateMap[createdAt] || 0) + 1;
    }
  });
  return participationCountByDateMap;
}

export function groupUserParticipatedPRListByDate(
  prList: PR[],
  username: string,
): Record<string, PR[]> {
  const participationPRListByDateMap: Record<string, PR[]> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
    if (hasUserParticipatedInPR(pr, username)) {
      participationPRListByDateMap[createdAt] = [
        ...(participationPRListByDateMap[createdAt] || []),
        pr,
      ];
    }
  });
  return participationPRListByDateMap;
}

export function calculateUserCreatedPRRatio(prList: PR[], username: string): number {
  const { created } = groupPRListByUserRole(prList, username);
  const userCreatedPRCount = created.length;
  const totalPRCount = prList.length;
  return totalPRCount > 0 ? userCreatedPRCount / totalPRCount : 0;
}

export function calculateUserParticipatedPRRatio(prList: PR[], username: string): number {
  const { participated } = groupPRListByUserRole(prList, username);
  const userParticipatedPRCount = participated.length;
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
  totalPRListCount: number;
  created: PRStatistics;
  participated: PRStatistics;
}

export function countPRListByStatus(prList: PR[]): PRStatistics['status'] {
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

export function groupPRListByStatus(prList: PR[]): Record<PRDetail['state'], PR[]> {
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

export function calculateUserPRStatistics(prList: PR[], username: string): UserPRStatistics {
  const { created, participated } = groupPRListByUserRole(prList, username);
  return {
    totalPRListCount: prList.length,
    created: {
      count: created.length,
      ratio: calculateUserCreatedPRRatio(prList, username),
      countByLabel: countPRListByLabel(created),
      status: countPRListByStatus(created),
    },
    participated: {
      count: participated.length,
      ratio: calculateUserParticipatedPRRatio(prList, username),
      countByLabel: countPRListByLabel(participated),
      status: countPRListByStatus(participated),
    },
  };
}

function extractDateFromDateTime(datetime: string): string {
  return datetime.split(' ')[0];
}
