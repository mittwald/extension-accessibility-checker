import { ScanModel } from "@/app/scan/scan.model";
import { Pa11yScanEngine } from "@/scan/Pa11yScanEngine";
import { ScanProfile } from "@/app/scanProfile/scanProfile.model";

export class ScanExecutor {
  static async executeQueuedScans() {
    const engine = new Pa11yScanEngine();

    const scans = await ScanModel.find({
      status: { $in: ["queued", "completed"] },
    });
    for (const scan of scans) {
      scan.status = "running";
      scan.save();

      const profile = await ScanProfile.findById(scan.profileId);

      if (profile === null) {
        scan.status = "failed";
        scan.save();
        continue;
      }

      await engine.executeScan(profile, scan);

      console.log("Issues found: ", scan.issues?.length);

      scan.status = "completed";
      scan.finishedAt = new Date();
      scan.save();
    }
  }
}
