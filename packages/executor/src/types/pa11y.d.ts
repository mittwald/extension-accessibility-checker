declare module "pa11y" {
  export interface Pa11yOptions {
    standard?: "WCAG2A" | "WCAG2AA" | "WCAG2AAA";
    timeout?: number;
    wait?: number;
    ignore?: string[];
    includeNotices?: boolean;
    includeWarnings?: boolean;
    actions?: string[];
    headers?: Record<string, string>;
    log?: {
      debug: (message: string) => void;
      error: (message: string) => void;
      info: (message: string) => void;
      log: (message: string) => void;
    };
    chromeLaunchConfig?: Record<string, any>;
    runners?: ("htmlcs" | "axe" | string)[];
    browser?: any;
    page?: any;
    // Add other options as needed
  }

  export interface Pa11yResults {
    documentTitle: string;
    pageUrl: string;
    issues: Pa11yIssue[];
  }

  export interface Pa11yIssue {
    code: string;
    context: string;
    message: string;
    type: "error" | "warning" | "notice";
    selector: string;
    runner: string;
  }

  interface Pa11y {
    (url: string, options?: Pa11yOptions): Promise<Pa11yResults>;
    (
      url: string,
      options: Pa11yOptions,
      callback: (error: Error | null, results: Pa11yResults) => void,
    ): void;

    defaults: Pa11yOptions;
    allowedStandards: string[];
  }

  const pa11y: Pa11y;

  export = pa11y;
}
