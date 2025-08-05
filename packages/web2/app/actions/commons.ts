import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";
import { notFound } from "@tanstack/react-router";
import cronParser from "cron-parser";

export async function assertProfile(profileId: string, contextId?: string) {
  const profile = await ScanProfileModel.findById(profileId);
  if (!profile || (contextId && profile.context.toString() !== contextId)) {
    throw notFound({ data: { type: "ScanProfile", profileId } });
  }
  return profile;
}

export async function scheduleScan(
  profileId: string,
  isSystemScan: boolean = false,
  contextId?: string,
) {
  const profile = await assertProfile(profileId, contextId);
  const user = isSystemScan ? "system" : "user";
  return ScanModel.createForProfile(profile, new Date(), user);
}

export const validateCron = (cronExpression: string | undefined) => {
  if (cronExpression) {
    try {
      const interval = cronParser.parseExpression(cronExpression);
      const firstDate = interval.next();
      const secondDate = interval.next();
      const hoursDiff =
        (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 1) {
        return new Response(
          "Cron expression must not run more than once per hour",
          { status: 400 },
        );
      }
    } catch (e) {
      return new Response("Invalid cron expression", { status: 400 });
    }
  }
  return true;
};
