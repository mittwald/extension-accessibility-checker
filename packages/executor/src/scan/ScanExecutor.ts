import { Scan, ScanModel } from "extension-a11y-checker-storage";
import { ScanEngineFactory } from "./engines/ScanEngine.js";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { logger } from "../logger.js";

const log = logger.child({ module: "ScanExecutor" });

export class ScanExecutor {
  static async executePendingScan() {
    const scan = await ScanModel.getNextPending();
    if (!scan) {
      log.trace("No scans found. Try again later.");
      return;
    }
    log.info(`📋 Scan found to execute`);

    log.debug("Starting Scan");
    await this.executeScan(scan);
    await this.scheduleNextScan(scan);
  }

  private static async executeScan(scan: DocumentType<Scan>) {
    await scan.populate("profile");
    if (!isDocument(scan.profile)) {
      await scan.markAsFailed("Profile not found");
      return;
    }

    log.info("▶️ executing scan: %s", scan._id);
    try {
      const engine = ScanEngineFactory.buildFor(scan);
      const results = await engine.executeScan();
      scan.issues = results.issues;
      scan.pages = results.pages;
      log.info("✅ Scan execution finished: %s", scan._id);
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
