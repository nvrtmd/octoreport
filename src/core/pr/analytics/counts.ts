import {
  hasUserParticipatedInPR,
  hasUserAuthoredPR,
  filterCompletedReviewRequestPRList,
  filterPendingReviewRequestPRList,
  filterPRListByReviewer,
  filterPRListByCommenter,
  filterPRListByParticipation,
  hasUserBeenRequestedToReview,
  filterPRListSelfInitiatedReviewedByUser,
} from '../filters';

import { PRStatistics } from './types';

import { extractDateFromDateTime } from '@/core/utils';
import { PR } from '@/types';

export function countTotalPRList(prList: PR[]): number {
  return prList.length;
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

export function countUserCreatedPRListByDate(
  prList: PR[],
  username: string,
): Record<string, number> {
  const creationCountByDateMap: Record<string, number> = {};
  prList.forEach((pr) => {
    const createdAt = extractDateFromDateTime(pr.createdAt);
    if (hasUserAuthoredPR(pr, username)) {
      creationCountByDateMap[createdAt] = (creationCountByDateMap[createdAt] || 0) + 1;
    }
  });
  return creationCountByDateMap;
}

export function countUserParticipatedPRListByDate(
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

export function countTotalReviewRequestsForUser(prList: PR[], username: string): number {
  const totalReviewRequests = prList.filter((pr) => hasUserBeenRequestedToReview(pr, username));
  return totalReviewRequests.length;
}

export function countReviewRequestsCompletedByUser(prList: PR[], username: string): number {
  const completedReviewRequests = filterCompletedReviewRequestPRList(prList, username);
  return completedReviewRequests.length;
}

export function countReviewRequestsPendingByUser(prList: PR[], username: string): number {
  const pendingReviewRequests = filterPendingReviewRequestPRList(prList, username);
  return pendingReviewRequests.length;
}

export function countSelfInitiatedReviewedPRListByUser(prList: PR[], username: string): number {
  const selfInitiatedReviews = filterPRListSelfInitiatedReviewedByUser(prList, username);
  return selfInitiatedReviews.length;
}

export function countPRListReviewedByUser(prList: PR[], username: string): number {
  const prListReviewedByUser = filterPRListByReviewer(prList, username);
  return prListReviewedByUser.length;
}

export function countPRListCommentedByUser(prList: PR[], username: string): number {
  const prListCommentedByUser = filterPRListByCommenter(prList, username);
  return prListCommentedByUser.length;
}

export function countPRListParticipatedByUser(prList: PR[], username: string): number {
  const prListParticipatedByUser = filterPRListByParticipation(prList, username);
  return prListParticipatedByUser.length;
}
