import { Issue, Page, Scan } from "extension-a11y-checker-storage";
import pa11y, { Pa11yIssue, Pa11yOptions, Pa11yResults } from "pa11y";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { PageResult, ScanEngine, ScanResults } from "./ScanEngine.js";
import { logger } from "../../logger.js";
import { Lighthouse } from "../Lighthouse.js";
import { pa11yLogger, puppeteerLaunchOptions } from "../helpers.js";
import puppeteer from "puppeteer";

const log = logger.child({ module: "Pa11yScanEngine" });

type URLExecutionResults = {
  issues: Issue[];
  page: Required<Pick<Page, "title" | "issues">>;
};

export class Pa11yScanEngine implements ScanEngine, ScanResults {
  protected scan: DocumentType<Scan>;
  protected options: Pa11yOptions;

  public issues: Issue[] = [];
  public pages: PageResult[] = [];

  constructor(scan: DocumentType<Scan>) {
    this.scan = scan;
    this.options = isDocument(scan.profile)
      ? {
          standard: scan.profile.standard,
          includeNotices: scan.profile.includeNotices,
          includeWarnings: scan.profile.includeWarnings,
          runners: ["htmlcs"],
        }
      : {};
  }

  public async executeScan(): Promise<ScanResults> {
    try {
      for (const page of this.scan.pages) {
        await this.runPageScan(page);
      }
      log.debug("📝 Issues found: %d", this.issues.length);
    } catch (e) {
      throw e;
    }

    return this;
  }

  protected async runPageScan(page: Page) {
    const [pa11yResults, lighthousePageScore] = await Promise.all([
      this.executePa11yForURL(page.url),
      Lighthouse.calculateA11yScore(page.url),
    ]);

    this.issues.push(...pa11yResults.issues);
    this.pages.push({
      ...pa11yResults.page,
      url: page.url,
      score: lighthousePageScore,
    });
  }

  protected async executePa11yForURL(
    url: string,
  ): Promise<URLExecutionResults> {
    let browser;
    let page;
    try {
      browser = await puppeteer.launch({
        ...puppeteerLaunchOptions,
      });
      page = await browser.newPage();

      const pa11yResults = await pa11y(url, {
        ...this.options,
        browser,
        page,
        log: pa11yLogger(url),
      });

      return this.convertPallyResults(pa11yResults);
    } catch (e) {
      throw e;
    } finally {
      await page?.close();
      await browser?.close();
    }
  }

  private convertPallyResults(pa11yResults: Pa11yResults): URLExecutionResults {
    const pageResults: URLExecutionResults["page"] = {
      title: pa11yResults.documentTitle,
      issues: {
        errors: 0,
        warnings: 0,
        notices: 0,
      },
    };

    const mappedIssues = pa11yResults.issues.map((i) => {
      pageResults.issues[`${i.type}s`] = pageResults.issues[`${i.type}s`] + 1;
      return this.convertToUnifiedIssue(i, pa11yResults);
    });

    return {
      issues: mappedIssues,
      page: pageResults,
    };
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
}
