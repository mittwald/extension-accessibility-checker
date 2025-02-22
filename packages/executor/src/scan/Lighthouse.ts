import puppeteer from "puppeteer";
import lighthouse, { Flags } from "lighthouse";
import { logger } from "../logger.js";
import { puppeteerLaunchOptions } from "./helpers.js";
import { Logger } from "pino";

export class Lighthouse {
  protected static flags: (port: number) => Flags = (port) => ({
    logLevel: "error",
    output: "html",
    onlyCategories: ["accessibility"],
    port: port,
    screenEmulation: { mobile: false, width: 1280, height: 1024 },
    formFactor: "desktop",
  });

  public static async calculateA11yScore(
    url: string,
  ): Promise<number | undefined> {
    const log = logger.child({ url, module: "Lighthouse" });

    log.debug("⛴️ Calculating LH Accessibility score");

    const browser = await puppeteer.launch({ ...puppeteerLaunchOptions });
    const { port } = new URL(browser.wsEndpoint());

    try {
      const parsedPort = parseInt(port);
      return await this.runLighthouseScan(url, parsedPort, log);
    } catch (e) {
      log.error(e, "💥 Error calculating LH score: %s", e);
    } finally {
      await browser.close();
    }
  }

  protected static async runLighthouseScan(
    url: string,
    port: number,
    log: Logger,
  ): Promise<number | undefined> {
    const lighthouseResult = await lighthouse(url, this.flags(port));

    if (!lighthouseResult?.lhr.categories.accessibility.score) {
      return;
    }
    const score = Math.round(
      lighthouseResult.lhr.categories.accessibility.score * 100,
    );
    log.debug("⛴️ LH Accessibility score: %d", score);
    return score;
  }
}
