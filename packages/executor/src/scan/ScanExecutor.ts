import { Scan, ScanModel } from "extension-a11y-checker-storage";
import { Pa11yScanEngine } from "./Pa11yScanEngine.js";
import { ScanEngine } from "./ScanEngine";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { logger } from "../logger.js";

const log = logger.child({ module: "ScanExecutor" });

export class ScanExecutor {
  protected static engine: ScanEngine = new Pa11yScanEngine();

  static async executePendingScans() {
    const scans = await ScanModel.findPending();
    if (scans.length === 0) {
      log.trace("No scans found. Try again later.");
      return;
    }
    log.info(`📋 Scans found to execute: ${scans.length}`);

    log.debug(`Marking scans as running: ${scans.length}`);
    await Promise.all(scans.map((s) => s.markAsRunning()));
    log.debug("Starting Scans");

    for (const scan of scans) {
      await this.executeScan(scan);
      await this.scheduleNextScan(scan);
    }
  }

  private static async executeScan(scan: DocumentType<Scan>) {
    await scan.populate("profile");
    if (!isDocument(scan.profile)) {
      await scan.markAsFailed("Profile not found");
      return;
    }

    log.info("▶️ executing scan: %s", scan._id);
    try {
      await this.engine.executeScan(scan);
      log.debug("✅ Issues found: %d", scan.issues?.length);
      await scan.markAsCompleted();
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      log.error(e, "💥 Error executing scan: %s", message);
      await scan.markAsFailed(message);
    }
  }

  private static async scheduleNextScan(scan: DocumentType<Scan>) {
    if (!isDocument(scan.profile)) {
      return;
    }

    const executionDate = scan.profile.nextExecution();
    if (scan.scheduledBy !== "system" || !executionDate) {
      log.debug("user scan or no schedule -> not scheduling next scan");
      return;
    }

    log.debug("scheduling next scan for profile %s", scan.profile._id);

    const nextScan = await ScanModel.createForProfile(
      scan.profile,
      executionDate,
    );
    log.debug(
      "next execution scheduled for: %s",
      nextScan.executionScheduledFor,
    );
  }
}
