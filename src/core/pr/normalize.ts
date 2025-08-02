import { uniqueArray, convertUTCISOToLocal } from '@/core';
import { PR, Participation } from '@/types';

export function normalizePRData(pr: PR): PR {
  return {
    ...pr,
    commenters: pr.commenters ? uniqueArray(pr.commenters) : null,
    reviewers: pr.reviewers ? uniqueArray(pr.reviewers) : null,
    createdAt: convertUTCISOToLocal(pr.createdAt),
    mergedAt: pr.mergedAt ? convertUTCISOToLocal(pr.mergedAt) : null,
    reviewRequestRecipientSet: pr.reviewRequestRecipientSet
      ? uniqueArray(pr.reviewRequestRecipientSet)
      : null,
  };
}

export function normalizeParticipation(pr: PR): Participation[] {
  return [...(pr.reviews || []), ...(pr.comments || [])];
}
