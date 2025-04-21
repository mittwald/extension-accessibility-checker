import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { ScanModel } from "extension-a11y-checker-storage";
import { assertProfile, scheduleScan } from "../../../actions/commons.js";
import { z } from "zod";
import { assertValidation, handleAPIError } from "../../../api/helpers.js";

const paramsSchema = z.object({
  profileId: z.string().length(24),
  projectId: z.string().uuid(),
});

export const APIRoute = createAPIFileRoute(
  "/api/projects/$projectId/scan-profiles/$profileId/scans",
)({
  GET: async ({ params }) => {
    const { projectId, profileId } = params;

    try {
      await assertValidation(paramsSchema, params);
      await assertProfile(profileId, projectId);

      const scans = await ScanModel.find({ profile: profileId });
      return json(scans);
    } catch (e) {
      return handleAPIError(e, "fetching scans");
    }
  },

  POST: async ({ params }) => {
    const { projectId, profileId } = params;

    try {
      await assertValidation(paramsSchema, params);

      const scan = await scheduleScan(profileId, false, projectId);
      return json(scan.toJSON(), { status: 202 });
    } catch (error) {
      return handleAPIError(error, "scheduling scan");
    }
  },
});
