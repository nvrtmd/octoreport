export interface PullRequest {
  title: string;
  url: string;
  createdAt: string;
  mergedAt?: string;
  labels: string[];
  author: string;
}

export interface Participation {
  pr: PullRequest;
  reviewedAt?: string;
  commentedAt?: string;
  responseTimeInHours?: number;
  respondedInTime?: boolean;
  role: "reviewer" | "commenter";
}

export interface MonthlyActivityReport {
  createdPRs: PullRequest[];
  participatedPRs: Participation[];
  summary: {
    totalCreated: number;
    totalParticipated: number;
    avgResponseTimeHours?: number;
  };
}
