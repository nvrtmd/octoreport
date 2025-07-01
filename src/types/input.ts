export interface DateRange {
  from: string;
  to: string;
}

export interface ActivityQueryOptions {
  username: string;
  repository: string;
  period: DateRange;
  targetBranch: string;
  labelFilter?: string[];
  responseDueInDays?: number;
}
