import {
  hasUserParticipatedInPR,
  hasUserAuthoredPR,
  hasCompletedReviewRequest,
  hasPendingReviewRequest,
  hasUserReviewed,
} from '../filters';

import { ReviewStatus, REVIEW_STATUS } from './types';

import { extractDateFromDateTime } from '@/core/utils';
import { PR, PRDetail } from '@/types';

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

export function groupPRListByReviewStatus(
  prList: PR[],
  username: string,
): Record<ReviewStatus, PR[]> {
  const prListByReviewStatusMap: Record<ReviewStatus, PR[]> = {
    [REVIEW_STATUS[0]]: [],
    [REVIEW_STATUS[1]]: [],
    [REVIEW_STATUS[2]]: [],
    [REVIEW_STATUS[3]]: [],
  };

  prList.forEach((pr) => {
    if (hasCompletedReviewRequest(pr, username)) {
      prListByReviewStatusMap[REVIEW_STATUS[0]].push(pr);
    } else if (hasPendingReviewRequest(pr, username)) {
      prListByReviewStatusMap[REVIEW_STATUS[1]].push(pr);
    } else if (hasUserReviewed(pr, username)) {
      prListByReviewStatusMap[REVIEW_STATUS[2]].push(pr);
    } else if (!hasUserAuthoredPR(pr, username)) {
      prListByReviewStatusMap[REVIEW_STATUS[3]].push(pr);
    }
  });

  return prListByReviewStatusMap;
}
