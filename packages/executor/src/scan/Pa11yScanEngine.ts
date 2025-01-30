import { Issue, Scan, ScanProfile } from "extension-a11y-checker-storage/src";
import { ScanEngine } from "./ScanEngine";
import pa11y, { Pa11yOptions } from "pa11y";

export class Pa11yScanEngine implements ScanEngine {
  public async executeScan(profile: ScanProfile, scan: Scan): Promise<void> {
    const options: Pa11yOptions = {
      ...profile,
    };

    if (!scan.issues) {
      scan.issues = [];
    }

    try {
      for (const url of scan.urls) {
        await this.executeURL(url, options, scan);
      }
      scan.status = "completed";
    } catch (e) {
      scan.status = "failed";
    }
  }

  protected async executeURL(url: string, options: Pa11yOptions, scan: Scan) {
    const results = await new Pa11yRunner().run(url, options);
    const mappedIssues: Issue[] = results.issues.map((issue) => {
      return {
        errorCode: issue.code,
        severity: issue.type,
        description: issue.message,
        selector: issue.selector,
        codeSnippet: issue.context,
      };
    });
    scan.issues?.push(...mappedIssues);
  }
}

class Pa11yRunner {
  public async run(url: string, options: Pa11yOptions) {
    const pa11yOptions = {
      ...options,
      log: {
        debug: console.debug,
        error: console.error,
        info: console.info,
        log: console.log,
      },
    };

    return pa11y(url, pa11yOptions);
  }
}
