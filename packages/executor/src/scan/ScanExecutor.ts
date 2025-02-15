import { Scan, ScanModel } from "extension-a11y-checker-storage";
import { Pa11yScanEngine } from "./Pa11yScanEngine.js";
import { ScanEngine } from "./ScanEngine";
import { DocumentType, isDocument } from "@typegoose/typegoose";

export class ScanExecutor {
  protected static engine: ScanEngine = new Pa11yScanEngine();

  static async executePendingScans() {
    const scans = await ScanModel.findPending();
    console.log(`Scans found to execute: ${scans.length}`);
    for (const scan of scans) {
      await this.executeScan(scan);
      await this.scheduleNextScan(scan);
    }
  }

  private static async executeScan(scan: DocumentType<Scan>) {
    await scan.markAsRunning();

    await scan.populate("profile");
    if (!isDocument(scan.profile)) {
      await scan.markAsFailed("Profile not found");
      return;
    }

    console.log("executing scan: ", scan._id);
    try {
      await this.engine.executeScan(scan);
      console.log("Issues found: ", scan.issues?.length);
      await scan.markAsCompleted();
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      await scan.markAsFailed(message);
    }
  }

  private static async scheduleNextScan(scan: DocumentType<Scan>) {
    if (!isDocument(scan.profile)) {
      return;
    }

    const executionDate = scan.profile.nextExecution();
    if (scan.scheduledBy !== "system" || !executionDate) {
      return;
    }

    const nextScan = await ScanModel.createForProfile(
      scan.profile,
      executionDate,
    );
    console.log(
      "next execution scheduled for: ",
      nextScan.executionScheduledFor,
    );
  }
}
