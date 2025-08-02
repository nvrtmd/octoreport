import { PRDetail } from '@/types';

export interface PRStatistics {
  count: number;
  ratio: number;
  countByLabel: Record<string, number>;
  status: Record<PRDetail['state'], number>;
}

export interface UserPRStatistics {
  totalPRListCount: number;
  created: PRStatistics;
  participated: PRStatistics;
}

export const REVIEW_STATUS = [
  'reviewedByRequest',
  'pendingReviewRequest',
  'selfInitiatedReviewed',
  'uninvolvedInReview',
] as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[number];

export interface ReviewStatistics {
  count: number;
  ratioToRequested: number | null;
  ratioToTotal: number | null;
}

export interface UserReviewStatistics {
  reviewedByRequest: ReviewStatistics;
  pendingReviewRequest: ReviewStatistics;
  selfInitiatedReviewed: ReviewStatistics;
  uninvolvedInReview: ReviewStatistics;
}
