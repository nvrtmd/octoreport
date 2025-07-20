export interface PR {
  number: number;
  title: string;
  url: string;
  createdAt: string;
  mergedAt?: string;
  labels: string[];
  author: string;
  targetBranch?: string;
  reviewers: string[];
  commenters?: string[];
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  isDraft: boolean;
  merged: boolean;
  mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
  reviewDecision: 'CHANGES_REQUESTED' | 'APPROVED' | 'REVIEW_REQUIRED' | null;
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
