import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";
import { notFound } from "@tanstack/react-router";

export async function assertProfile(profileId: string, projectId?: string) {
  const profile = await ScanProfileModel.findById(profileId);
  if (!profile || (projectId && profile.project.toString() !== projectId)) {
    throw notFound({ data: { type: "ScanProfile", profileId } });
  }
  return profile;
}

export async function scheduleScan(
  profileId: string,
  isSystemScan: boolean = false,
  projectId?: string,
) {
  const profile = await assertProfile(profileId, projectId);
  const user = isSystemScan ? "system" : "user";
  return ScanModel.createForProfile(profile, new Date(), user);
}
