export interface PullRequest {
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
  pr: PullRequest;
  reviewSubmittedAt?: string;
  commentedAt?: string;
  responseTimeInHours?: number;
  respondedInTime?: boolean;
  role: "reviewer" | "commenter";
}

export interface MonthlyActivityReport {
  createdPRs: PullRequest[];
  participations: Participation[];
  summary: {
    totalCreated: number;
    totalParticipated: number;
    averageResponseTimeHours?: number;
  };
}
