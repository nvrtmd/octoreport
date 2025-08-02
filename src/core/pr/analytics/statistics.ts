import {
  countPRListByLabel,
  countPRListByStatus,
  countTotalPRList,
  countTotalReviewRequestsForUser,
} from './counts';
import {
  calculateUserCreatedPRRatio,
  calculateUserParticipatedPRRatio,
  groupPRListByReviewStatus,
  groupPRListByUserRole,
} from './groups';
import { UserPRStatistics, UserReviewStatistics } from './types';

import { PR } from '@/types';

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

export function calculateUserReviewStatistics(
  prList: PR[],
  username: string,
): UserReviewStatistics {
  const { reviewedByRequest, pendingReviewRequest, selfInitiatedReviewed, uninvolvedInReview } =
    groupPRListByReviewStatus(prList, username);
  const totalPRListCount = countTotalPRList(prList);
  const totalRequestedCount = countTotalReviewRequestsForUser(prList, username);
  const isTotalCountValid = totalPRListCount > 0;
  const isRequestedCountValid = totalRequestedCount > 0;

  return {
    reviewedByRequest: {
      count: reviewedByRequest.length,
      ratioToRequested: isRequestedCountValid
        ? reviewedByRequest.length / totalRequestedCount
        : null,
      ratioToTotal: isTotalCountValid ? reviewedByRequest.length / totalPRListCount : null,
    },
    pendingReviewRequest: {
      count: pendingReviewRequest.length,
      ratioToRequested: isRequestedCountValid
        ? pendingReviewRequest.length / totalRequestedCount
        : null,
      ratioToTotal: isTotalCountValid ? pendingReviewRequest.length / totalPRListCount : null,
    },
    selfInitiatedReviewed: {
      count: selfInitiatedReviewed.length,
      ratioToTotal: isTotalCountValid ? selfInitiatedReviewed.length / totalPRListCount : null,
      ratioToRequested: null,
    },
    uninvolvedInReview: {
      count: uninvolvedInReview.length,
      ratioToTotal: isTotalCountValid ? uninvolvedInReview.length / totalPRListCount : null,
      ratioToRequested: null,
    },
  };
}
