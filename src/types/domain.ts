export interface PR {
  number: number;
  title: string;
  url: string;
  createdAt: string;
  mergedAt?: string;
  labels: string[];
  author: string;
  reviewers: string[];
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
  createdPRs: PR[];
  participations: Participation[];
  summary: {
    totalCreated: number;
    totalParticipated: number;
    averageResponseTimeHours?: number;
  };
}
