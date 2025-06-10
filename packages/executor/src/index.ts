import "reflect-metadata";

import cron from "node-cron";
import { dbConnect } from "extension-a11y-checker-storage";
import { ScanExecutor } from "./scan/ScanExecutor.js";
import { logger } from "./logger.js";
import { Lighthouse } from "./scan/Lighthouse.js";

const log = logger.child({ module: "Executor" });

async function main() {
  log.info("Connecting to DB...");
  const db = await dbConnect();

  const execScans = async () => {
    log.trace("››› Starting scans...");
    await ScanExecutor.executePendingScan();
    log.trace("✓✓✓ Scans finished");
  };

  await execScans();

  // todo: make this configurable
  // every 10 seconds
  const cronExpr = "*/10 * * * * *";
  log.info("Starting scan scheduler... %o", { cronExpr });
  cron.schedule(cronExpr, execScans);

  const cleanUp = async () => {
    log.info("Shutting down gracefully...");
    Lighthouse.cleanUpChildProcesses();
    await db.disconnect();
  };
  process.on("SIGINT", () => {
    cleanUp().then(() => process.exit(130));
  });
  process.on("SIGTERM", () => {
    cleanUp().then(() => process.exit(143));
  });
}

main().catch((err) => {
  log.error(err, "Error handling server: %s", err.message);
  process.exit(1);
});
