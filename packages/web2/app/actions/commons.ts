import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";
import { notFound } from "@tanstack/react-router";

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
