export type PR = PRListItem & Partial<PRDetail>;

export interface PRListItem {
  number: number;
  title: string;
  url: string;
  createdAt: string;
  user: string | null;
}

export interface PRDetail {
  targetBranch: string;
  assignees: string[];
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  merged: boolean;
  isDraft: boolean;
  mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';

  labels?: string[] | null;
  author?: string | null;
  reviewers?: string[] | null;
  commenters?: string[] | null;
  reviewDecision?: 'CHANGES_REQUESTED' | 'APPROVED' | 'REVIEW_REQUIRED' | null;
  mergedAt?: string | null;
  requestedReviewers?: string[] | null;
}

export interface Participation {
  pr: PR;
  reviewSubmittedAt?: string;
  commentedAt?: string;
  responseTimeInHours?: number;
  respondedInTime?: boolean;
  role: 'reviewer' | 'commenter';
}

export interface MonthlyActivityReport {
  createdPRList: PR[];
  participations: Participation[];
  summary: {
    totalCreated: number;
    totalParticipated: number;
    averageResponseTimeHours?: number;
  };
}
