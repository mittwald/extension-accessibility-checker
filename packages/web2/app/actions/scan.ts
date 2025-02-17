import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";

export const startScan = createServerFn({ method: "POST" })
  .validator(
    z.object({ profileId: z.string(), isSystemScan: z.boolean().optional() }),
  )
  .handler(async ({ data: { profileId, isSystemScan } }) => {
    const profile = await ScanProfileModel.findById(profileId);
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }
    const user = isSystemScan ? "system" : "user";
    await ScanModel.createForProfile(profile, new Date(), user);
  });
