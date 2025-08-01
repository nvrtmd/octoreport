import {
  hasUserParticipatedInPR,
  hasUserAuthoredPR,
  filterCompletedReviewRequestPRList,
  filterPendingReviewRequestPRList,
  filterPRListByReviewer,
  filterPRListByCommenter,
  filterPRListByParticipation,
  hasCompletedReviewRequest,
  hasPendingReviewRequest,
  hasUserReviewed,
  hasUserBeenRequestedToReview,
  filterPRListSelfInitiatedReviewedByUser,
  filterParticipationByUser,
} from './filters';

import { PR, PRDetail, Participation } from '@/types';

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

const REVIEW_STATUS = [
  'reviewedByRequest',
  'pendingReviewRequest',
  'selfInitiatedReviewed',
  'uninvolvedInReview',
] as const;
type ReviewStatus = (typeof REVIEW_STATUS)[number];

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

interface ReviewStatistics {
  count: number;
  ratioToRequested: number | null;
  ratioToTotal: number | null;
}

interface UserReviewStatistics {
  reviewedByRequest: ReviewStatistics;
  pendingReviewRequest: ReviewStatistics;
  selfInitiatedReviewed: ReviewStatistics;
  uninvolvedInReview: ReviewStatistics;
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

function extractDateFromDateTime(datetime: string): string {
  return datetime.split(' ')[0];
}

export function getFirstParticipationTime(
  participation: Participation[],
  username: string,
): string | null {
  if (!participation || participation.length === 0) {
    return null;
  }
  const filteredParticipationByUser = filterParticipationByUser(participation, username);
  const timestamps = filteredParticipationByUser
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map((item) => ('submittedAt' in item ? item.submittedAt : item.createdAt))
    .filter((timestamp): timestamp is string => timestamp !== 'Invalid Date' && timestamp !== null);
  return timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ?? null;
}
