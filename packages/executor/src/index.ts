import dbConnect from "extension-a11y-checker-storage/src/lib/mongodb";
import { ScanExecutor } from "./scan/ScanExecutor";

(async () => {
  console.info("connection to DB");
  const db = await dbConnect();

  console.info("››› starting scans");
  await ScanExecutor.executeQueuedScans();
  console.info("✓✓✓ scans finished");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db.disconnect();
})();
