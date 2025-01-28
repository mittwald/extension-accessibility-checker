import dbConnect from "./lib/mongodb";
import { ScanExecutor } from "./scan/ScanExecutor";

(async () => {
  console.info("connection to DB");
  const db = await dbConnect();

  console.info("››› starting scans");
  await ScanExecutor.executeQueuedScans();
  console.info("✓✓✓ scans finished");

  // await db.disconnect();
})();
