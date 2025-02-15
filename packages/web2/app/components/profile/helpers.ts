import { Scan } from "../../api/types.ts";

export const isRunning = (scan: Scan) => {
  return scan.status === "running";
};

export const isPending = (scan: Scan) => {
  const nextExecution = new Date(scan.executionScheduledFor);
  return scan.status === "queued" && nextExecution <= new Date();
};
