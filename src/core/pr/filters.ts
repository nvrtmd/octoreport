import { PR } from '@/types';

export function hasUserAuthoredPR(pr: PR, username: string): boolean {
  return pr.author === username;
}

export function hasUserParticipatedInPR(pr: PR, username: string): boolean {
  return !!(
    pr.author !== username &&
    (pr.reviewers?.includes(username) || pr.commenters?.includes(username))
  );
}

export function hasUserBeenRequestedToReview(pr: PR, username: string): boolean {
  return !!pr.reviewRequestRecipientSet?.some((item) => item === username);
}

export function hasUnrespondedReviewRequest(pr: PR, username: string): boolean {
  return !!pr.requestedReviewers?.some((reviewer) => reviewer === username);
}

export function hasUserReviewed(pr: PR, username: string): boolean {
  return !!pr.reviewers?.some((reviewer) => reviewer === username);
}

export function hasUserCommented(pr: PR, username: string): boolean {
  return !!pr.commenters?.some((commenter) => commenter === username);
}

export function hasCompletedReviewRequest(pr: PR, username: string): boolean {
  return hasUserBeenRequestedToReview(pr, username) && !hasUnrespondedReviewRequest(pr, username);
}

export function filterPRListByAuthor(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserAuthoredPR(pr, username));
}

export function filterPRListByReviewer(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => pr.reviewers?.includes(username));
}

export function filterPRListByCommenter(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserCommented(pr, username));
}

export function filterPRListByParticipation(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUserParticipatedInPR(pr, username));
}

export function filterPRListNotAuthoredByUser(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => pr.author !== username);
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

export function filterPRListByUnrespondedReviewRequest(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => hasUnrespondedReviewRequest(pr, username));
}
