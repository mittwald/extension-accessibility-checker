import "reflect-metadata";

import cron from "node-cron";
import { dbConnect } from "extension-a11y-checker-storage";
import { ScanExecutor } from "./scan/ScanExecutor.js";
import { logger } from "./logger.js";

const log = logger.child({ module: "Executor" });

async function main() {
  log.info("Connecting to DB...");
  const db = await dbConnect();

  const execScans = async () => {
    log.trace("››› Starting scans...");
    await ScanExecutor.executePendingScans();
    log.trace("✓✓✓ Scans finished");
  };

  await execScans();

  log.info("Starting scan scheduler...");
  // todo: make this configurable
  // every 10 seconds
  const cronExpr = "*/10 * * * * *";
  cron.schedule(cronExpr, execScans);

  process.on("SIGINT", async () => {
    log.info("Shutting down gracefully...");
    await db.disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  log.error(err, "Error initializing server: %s", err.message);
  process.exit(1);
});
