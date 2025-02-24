import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { scheduleScan } from "./commons.js";

export const startScan = createServerFn({ method: "POST" })
  .validator(
    z.object({ profileId: z.string(), isSystemScan: z.boolean().optional() }),
  )
  .handler(async ({ data: { profileId, isSystemScan } }) => {
    await scheduleScan(profileId, isSystemScan);
  });
