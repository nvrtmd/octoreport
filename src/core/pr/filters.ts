import { PR, Participation } from '@/types';

export function hasUserAuthoredPR(pr: PR, username: string): boolean {
  return pr.author === username;
}

// TODO: Make it optional to include cases where author is a username
export function hasUserParticipatedInPR(pr: PR, username: string): boolean {
  return !!(
    pr.author !== username &&
    (hasUserReviewed(pr, username) || hasUserCommented(pr, username))
  );
}

export function hasUserBeenRequestedToReview(pr: PR, username: string): boolean {
  return !!pr.reviewRequestRecipientSet?.includes(username) && pr.author !== username;
}

export function hasPendingReviewRequest(pr: PR, username: string): boolean {
  return !!pr.requestedReviewers?.includes(username) && pr.author !== username;
}

export function hasUserReviewed(pr: PR, username: string): boolean {
  return !!pr.reviewers?.includes(username) && pr.author !== username;
}

export function hasUserCommented(pr: PR, username: string): boolean {
  return !!pr.commenters?.includes(username) && pr.author !== username;
}

export function hasCompletedReviewRequest(pr: PR, username: string): boolean {
  return hasUserBeenRequestedToReview(pr, username) && !hasPendingReviewRequest(pr, username);
}

export function filterPRListByAuthor(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserAuthoredPR(pr, username));
}

export function filterPRListNotAuthoredByUser(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => !hasUserAuthoredPR(pr, username));
}

export function filterPRListByReviewer(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserReviewed(pr, username));
}

export function filterPRListByCommenter(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserCommented(pr, username));
}

export function filterPRListByParticipation(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserParticipatedInPR(pr, username));
}

export function filterPRListByTargetBranch(prList: PR[], targetBranch: string): PR[] {
  const parsedTargetBranch = targetBranch.includes(':') ? targetBranch.split(':')[1] : targetBranch;
  return prList.filter((pr) => pr.targetBranch === parsedTargetBranch);
}

export function filterPRListByLabel(prList: PR[], labelFilter: string[]): PR[] {
  return prList.filter((pr) =>
    labelFilter.some((filter) =>
      pr.labels?.some((label) => label.toLowerCase().includes(filter.toLowerCase())),
    ),
  );
}

export function filterCompletedReviewRequestPRList(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasCompletedReviewRequest(pr, username));
}

export function filterPendingReviewRequestPRList(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasPendingReviewRequest(pr, username));
}

export function filterPRListSelfInitiatedReviewedByUser(prList: PR[], username: string): PR[] {
  return prList.filter(
    (pr) => hasUserReviewed(pr, username) && !hasUserBeenRequestedToReview(pr, username),
  );
}

export function filterParticipationByUser(
  participation: Participation[],
  username: string,
): Participation[] {
  if (!participation) {
    return [];
  }
  return participation.filter((item) => item?.author?.login === username);
}
