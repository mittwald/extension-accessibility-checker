import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { ScanModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute(
  "/api/projects/$projectId/scan-profiles/$profileId/scans/$scanId",
)({
  GET: async ({ params }) => {
    const { projectId, profileId, scanId } = params;

    const scan = await ScanModel.findById(scanId).populate("profile").exec();
    if (!scan || !scan.profile || scan.profile._id.toString() !== profileId) {
      return json({ message: "Scan not found" }, { status: 404 });
    }
    return json(scan.toJSON());
  },

  DELETE: async ({ params }) => {
    const { projectId, profileId, scanId } = params;

    const scan = await ScanModel.findByIdAndDelete(scanId);
    if (!scan || !scan.profile || scan.profile._id.toString() !== profileId) {
      return json({ message: "Scan not found" }, { status: 404 });
    }
    return json(scan.toJSON());
  },
});
