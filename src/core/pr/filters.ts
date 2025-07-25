import { PR } from '@/types';

export function filterPRListByAuthor(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => pr.author === username);
}

export function filterPRListByReviewer(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => pr.reviewers?.includes(username));
}

export function filterPRListByCommenter(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => pr.commenters?.includes(username));
}

export function isUserParticipatedInPR(pr: PR, username: string): boolean {
  return !!(
    pr.author !== username &&
    (pr.reviewers?.includes(username) || pr.commenters?.includes(username))
  );
}

export function filterPRListByParticipation(prList: PR[], username: string): PR[] {
  return prList.filter((pr) => isUserParticipatedInPR(pr, username));
}

export function filterPRListByOthers(prList: PR[], username: string): PR[] {
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
