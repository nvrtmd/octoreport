import { uniqueArray, convertUTCISOToLocal } from '@/core';
import { PR } from '@/types';

export function normalizePRData(pr: PR): PR {
  return {
    ...pr,
    comments: uniqueArray(pr.comments ?? []),
    reviewers: uniqueArray(pr.reviewers),
    createdAt: convertUTCISOToLocal(pr.createdAt),
    mergedAt: pr.mergedAt ? convertUTCISOToLocal(pr.mergedAt) : 'Not merged yet',
  };
}
