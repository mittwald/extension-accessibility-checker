import { Issue, Page, Scan } from "extension-a11y-checker-storage";
import pa11y, { Pa11yOptions, Pa11yResults, Pa11yIssue } from "pa11y";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { ScanEngine } from "./ScanEngine.js";
import puppeteer from "puppeteer";
import lighthouse, { Flags } from "lighthouse";

export class Pa11yScanEngine implements ScanEngine {
  public async executeScan(scan: DocumentType<Scan>): Promise<void> {
    // todo: refactor this to use spread operator with subclass
    const options: Pa11yOptions = isDocument(scan.profile)
      ? {
          standard: scan.profile.standard,
          includeNotices: scan.profile.includeNotices,
          includeWarnings: scan.profile.includeWarnings,
          runners: ["htmlcs"],
        }
      : {};

    if (!scan.issues) {
      scan.issues = [];
    }

    try {
      for (const page of scan.pages) {
        await Promise.all([
          this.executePa11yForURL(page, options, scan),
          this.calculateLighthouseScore(page, scan),
        ]);
      }
      scan.status = "completed";
    } catch (e) {
      console.error(e);
      scan.status = "failed";
    }
  }

  protected async executePa11yForURL(
    page: Page,
    options: Pa11yOptions,
    scan: Scan,
  ) {
    const results = await new Pa11yRunner().run(page.url, options);
    page.title = results.documentTitle;
    const mappedIssues: Issue[] = results.issues.map((i) =>
      this.convertToUnifiedIssue(i, results),
    );
    page.issues = mappedIssues.reduce(
      (c, i) => ({
        ...c,
        [`${i.severity}s`]: c[`${i.severity}s`] + 1,
      }),
      {
        errors: 0,
        warnings: 0,
        notices: 0,
      },
    );
    scan.issues?.push(...mappedIssues);
  }

  private convertToUnifiedIssue(issue: Pa11yIssue, results: Pa11yResults) {
    const i = new Issue();
    i.url = results.pageUrl;
    i.errorCode = issue.code;
    i.severity = issue.type;
    i.description = issue.message;
    i.selector = issue.selector;
    i.context = issue.context;
    return i;
  }

  private async calculateLighthouseScore(page: Page, scan: DocumentType<Scan>) {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--headless"],
      headless: true,
    });
    const { port } = new URL(browser.wsEndpoint());

    const flags: Flags = {
      logLevel: "info",
      output: "html",
      onlyCategories: ["accessibility"],
      port: parseInt(port),
      screenEmulation: { mobile: false, width: 1200, height: 1080 },
      formFactor: "desktop",
    };

    try {
      const runnerResult = await lighthouse(page.url, flags);
      if (!runnerResult?.lhr.categories.accessibility.score) {
        return;
      }
      const score = Math.round(
        runnerResult.lhr.categories.accessibility.score * 100,
      );
      console.log("LH Accessibility score:", score);
      page.score = score;
    } catch (e) {
      console.error("Error calculating accessibility score:", e);
    } finally {
      await browser.close();
    }
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
      chromeLaunchConfig: {
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--headless"],
        headless: true,
        timeout: 10_000,
      },
    };

    return pa11y(url, pa11yOptions);
  }
}
