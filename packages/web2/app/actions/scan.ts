import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { scheduleScan } from "./commons.js";
import { dbMiddleware, profileAuthorizeMiddleware } from "./middleware.js";

export const startScan = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, profileAuthorizeMiddleware])
  .validator(
    z.object({ profileId: z.string(), isSystemScan: z.boolean().optional() }),
  )
  .handler(async ({ data: { profileId, isSystemScan } }) => {
    await scheduleScan(profileId, isSystemScan);
  });
