import { CommentsRaw, PRDetailRaw, ReviewsRaw } from '@/schemas/github';

export type PR = PRListItem & Partial<PRDetail>;

export interface PRListItem {
  number: number;
  title: string;
  url: string;
  createdAt: string;
  user: string | null;
}

export interface PRDetail {
  targetBranch: PRDetailRaw['baseRefName'];
  assignees: string[];
  state: PRDetailRaw['state'];
  merged: PRDetailRaw['merged'];
  isDraft: PRDetailRaw['isDraft'];
  mergeable: PRDetailRaw['mergeable'];
  timelineItems: PRDetailRaw['timelineItems']['nodes'];
  reviewRequestRecipientSet: PRDetail['requestedReviewers'];

  labels?: string[] | null;
  author?: string | null;
  reviewers?: string[] | null;
  reviews: (ReviewsRaw | null)[] | null;
  comments: CommentsRaw[] | null;
  commenters?: string[] | null;
  reviewDecision?: PRDetailRaw['reviewDecision'] | null;
  mergedAt?: PRDetailRaw['mergedAt'] | null;
  requestedReviewers?: string[] | null;
}

export type Participation = ReviewsRaw | CommentsRaw | null;
