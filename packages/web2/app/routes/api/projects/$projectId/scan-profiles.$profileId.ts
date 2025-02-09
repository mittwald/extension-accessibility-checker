import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute(
  "/api/projects/$projectId/scan-profiles/$profileId",
)({
  GET: async ({ params }) => {
    const { projectId, profileId } = params;
    const scanProfile = await ScanProfileModel.findById(profileId);
    if (!scanProfile || scanProfile.project._id.toString() !== projectId) {
      return json({ message: "Scan profile not found" }, { status: 404 });
    }
    const lastScan = await ScanModel.lastScanOfProfile(profileId);
    return json({
      ...scanProfile.toJSON(),
      issueSummary: lastScan?.getIssueSummary(),
    });
  },

  PUT: async ({ params, request }) => {
    const { projectId, profileId } = params;
    const scanProfile = await ScanProfileModel.findById(profileId);
    if (!scanProfile || scanProfile.project._id.toString() !== projectId) {
      return json({ message: "Scan profile not found" }, { status: 404 });
    }
    const input = await request.json();
    const updatedScanProfile = await ScanProfileModel.findByIdAndUpdate(
      profileId,
      { $set: { ...input, updatedAt: new Date(), projectId } },
      { new: true },
    );
    return json(updatedScanProfile!.toJSON());
  },

  DELETE: async ({ params }) => {
    const { projectId, profileId } = params;
    const deletedScanProfile = await ScanProfileModel.findOneAndDelete({
      projectId,
      _id: profileId,
    });
    if (!deletedScanProfile) {
      return json({ message: "Scan profile not found" }, { status: 404 });
    }
    await ScanModel.deleteMany({ profile: profileId });
    return json(deletedScanProfile.toJSON());
  },
});
