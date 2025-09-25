import { ScanProfile } from "../api/types.ts";
import { getIntervalValueFromCronSyntax } from "../components/profile/CronFields/lib.ts";

export function hasDailyCronInterval(profile: ScanProfile) {
  if (profile.cronSchedule === undefined) {
    return false;
  }
  return (
    getIntervalValueFromCronSyntax(profile.cronSchedule.expression) === "1d"
  );
}
