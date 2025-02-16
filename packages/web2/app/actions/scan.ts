import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";

export const startScan = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    const profile = await ScanProfileModel.findById(profileId);
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }
    await ScanModel.createForProfile(profile, new Date(), "user");
  });
