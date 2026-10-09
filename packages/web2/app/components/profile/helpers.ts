import { Scan } from "../../api/types.ts";
import { DateTime } from "luxon";

export const isRunning = (scan: Scan) => {
  return scan.status === "running";
};

export const isPending = (scan: Scan) => {
  return scan.status === "queued" && scan.executionScheduledFor <= new Date();
};

export const isRunningOrPending = (scan: Scan | undefined | null): boolean => {
  return !!(scan && (isRunning(scan) || isPending(scan)));
};

export const deletionDays = 90;
const deletionWarningDays = 14;

export const getDeletionDate = (scan?: Scan): DateTime | undefined => {
  const completionDate = scan?.completedAt
    ? DateTime.fromJSDate(scan.completedAt)
    : undefined;
  if (completionDate) {
    return completionDate.plus({ days: deletionDays });
  }
};

export const isDeletionDateSoon = (scan?: Scan): boolean => {
  const deletionDate = getDeletionDate(scan);

  if (!deletionDate) {
    return false;
  }

  const deletionWarningDate = deletionDate.minus({ days: deletionWarningDays });

  return deletionWarningDate.diffNow().as("days") <= 0;
};
