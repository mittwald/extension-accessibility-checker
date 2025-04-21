import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { ProjectModel, ScanProfileModel } from "extension-a11y-checker-storage";
import { ObjectId } from "mongodb";

export const APIRoute = createAPIFileRoute(
  "/api/projects/$projectId/scan-profiles",
)({
  GET: async ({ params }) => {
    const { projectId } = params;
    const scanProfiles = await ScanProfileModel.findForProject(projectId);
    if (scanProfiles === null) {
      return json({ message: "Project not found" }, { status: 404 });
    }
    return json(scanProfiles);
  },

  POST: async ({ params, request }) => {
    const { projectId } = params;
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return json({ message: "Project not found" }, { status: 404 });
    }
    const input = await request.json();
    const scanProfile = await ScanProfileModel.create({
      ...input,
      _id: new ObjectId(),
      project: project._id,
    });
    return json(scanProfile.toJSON(), { status: 201 });
  },
});
