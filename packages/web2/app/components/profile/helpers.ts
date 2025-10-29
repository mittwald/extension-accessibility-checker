import { Scan } from "~/api/types.ts";

export const isRunning = (scan: Scan) => {
  return scan.status === "running";
};

export const isPending = (scan: Scan) => {
  return scan.status === "queued" && scan.executionScheduledFor <= new Date();
};

export const isRunningOrPending = (scan: Scan | undefined | null): boolean => {
  return !!(scan && (isRunning(scan) || isPending(scan)));
};
