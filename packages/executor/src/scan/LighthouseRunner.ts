import { logger } from "../logger.js";
import puppeteer from "puppeteer";
import { puppeteerLaunchOptions } from "./helpers.js";
import { Logger } from "pino";
import lighthouse, { Flags } from "lighthouse";
import * as process from "node:process";

const flags: (port: number) => Flags = (port) => ({
  logLevel: "error",
  output: "html",
  onlyCategories: ["accessibility"],
  port: port,
  screenEmulation: { mobile: false, width: 1280, height: 1024 },
  formFactor: "desktop",
});

const runLighthouseScan = async (
  url: string,
  port: number,
  log: Logger,
): Promise<number | undefined> => {
  const lighthouseResult = await lighthouse(url, flags(port));

  if (!lighthouseResult?.lhr.categories.accessibility.score) {
    return;
  }
  const score = Math.round(
    lighthouseResult.lhr.categories.accessibility.score * 100,
  );
  log.debug("⛴️ LH Accessibility score: %d", score);
  return score;
};

(async () => {
  const url = process.argv[2]; // Get URL from command line arguments
  if (!url) {
    console.error("No URL provided.");
    process.exit(1);
  }

  const log = logger.child({ url, module: "LighthouseRunner" });

  log.debug("⛴️ Calculating LH Accessibility score");

  const browser = await puppeteer.launch({ ...puppeteerLaunchOptions });
  const { port } = new URL(browser.wsEndpoint());

  try {
    const parsedPort = parseInt(port);
    const score = await runLighthouseScan(url, parsedPort, log);
    await browser.close();

    process.send?.(score ?? "undefined");
    process.exit(0);
  } catch (e) {
    log.error(e, "💥 Error calculating LH score: %s", e);
    await browser.close();
    process.exit(1);
  }
})();
