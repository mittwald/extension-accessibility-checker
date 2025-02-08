import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute(
  "/api/projects/$projectId/scan-profiles/$profileId/scans",
)({
  GET: async ({ params }) => {
    const { projectId, profileId } = params;

    const scans = await ScanModel.find({ profile: profileId });
    return json(scans);
  },

  POST: async ({ params }) => {
    const { projectId, profileId } = params;

    const profile = await ScanProfileModel.findOne({
      _id: profileId,
      project: projectId,
    }).populate("project");
    if (!profile) {
      return json({ message: "Scan profile not found" }, { status: 404 });
    }

    const scan = await ScanModel.createForProfile(profile, new Date(), "user");

    return json(scan.toJSON(), { status: 202 });
  },
});
