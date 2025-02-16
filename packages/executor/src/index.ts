import "reflect-metadata";

import cron from "node-cron";
import { dbConnect } from "extension-a11y-checker-storage";
import { ScanExecutor } from "./scan/ScanExecutor.js";

async function main() {
  console.info("Connecting to DB...");
  const db = await dbConnect();

  const execScans = async () => {
    // console.info("››› Starting scans...");
    await ScanExecutor.executePendingScans();
    // console.info("✓✓✓ Scans finished");
  };

  await execScans();

  console.info("Starting scan scheduler...");
  // todo: make this configurable
  // every 10 seconds
  const cronExpr = "*/10 * * * * *";
  cron.schedule(cronExpr, execScans);

  process.on("SIGINT", async () => {
    console.info("Shutting down gracefully...");
    await db.disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Error initializing:", err);
  process.exit(1);
});
