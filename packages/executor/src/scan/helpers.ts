import type { LaunchOptions } from "puppeteer";
import type { Pa11yOptions } from "pa11y";
import { logger } from "../logger.js";

export const puppeteerLaunchOptions: LaunchOptions = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--headless",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
  ],
  headless: true,
};

export const pa11yLogger = (url: string): Pa11yOptions["log"] => {
  const pallyLogger = logger.child({ module: "Pa11y", url });
  return {
    debug: (m: string) => pallyLogger.debug(m),
    error: (m: string) => pallyLogger.error(m),
    info: (m: string) => pallyLogger.info(m),
    log: (m: string) => pallyLogger.debug(m),
  };
};
