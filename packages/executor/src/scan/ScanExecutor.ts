import { ScanModel } from "extension-a11y-checker-storage";
import { Pa11yScanEngine } from "./Pa11yScanEngine.js";

export class ScanExecutor {
  static async executeQueuedScans() {
    const engine = new Pa11yScanEngine();

    const scans = await ScanModel.find({
      status: { $in: ["queued"] },
      executionScheduledFor: { $lte: new Date() },
    });
    console.log(`Scans found to execute: ${scans.length}`);
    for (const scan of scans) {
      scan.status = "running";
      await scan.save();

      await scan.populate("profile");

      if (!scan.profile) {
        scan.status = "failed";
        await scan.save();
        continue;
      }

      console.log("executing scan: ", scan._id);
      await engine.executeScan(scan);

      console.log("Issues found: ", scan.issues?.length);

      scan.status = "completed";
      scan.completedAt = new Date();
      await scan.save();
    }
  }
}
