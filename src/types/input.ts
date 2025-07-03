export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ActivityQueryOptions {
  githubToken: string;
  username: string;
  repository: string;
  period: DateRange;
  targetBranch: string;
  labelFilter?: string[];
  responseSLAInDays?: number;
}
