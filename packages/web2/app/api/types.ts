interface CronScheduleJSON {
  expression: string;
}

export interface ScanProfile {
  _id: string;
  context: string;
  name: string;
  domain: string;
  paths: string[];
  standard: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
  includeNotices: boolean;
  includeWarnings: boolean;
  cronSchedule?: CronScheduleJSON;
  createdAt: Date;
  updatedAt: Date;
  issueSummary?: IssueSummary;

  lastScan?: Scan;
  nextScan?: Scan;
}

export interface Issue {
  errorCode: string;
  severity: "error" | "warning" | "notice";
  description: string;
  context?: string;
  selector?: string;
  url: string;
}

export interface Issues {
  errors: number;
  warnings: number;
  notices: number;
}

export interface IssueSummary extends Issues {
  score?: number;
}

export interface Page {
  url: string;
  title?: string;
  issues?: Issues;
  score?: number;
}

export interface Scan {
  _id: string;
  profile: string;
  pages: Page[];
  status: "queued" | "running" | "completed" | "failed";
  issues?: Issue[];
  error?: string;
  scheduledBy: "system" | string;
  createdAt: Date;
  updatedAt: Date;
  executionScheduledFor: Date;
  completedAt?: Date;
}
