import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { ProjectModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute("/api/projects/$projectId")({
  GET: async ({ params }) => {
    const { projectId } = params;
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return json({ message: "Project not found" }, { status: 404 });
    }
    return json(project.toJSON());
  },

  PUT: async ({ params, request }) => {
    const { projectId } = params;
    const input = await request.json();
    const project = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $set: { ...input, updatedAt: new Date() } },
      { new: true },
    );
    if (!project) {
      return json({ message: "Project not found" }, { status: 404 });
    }
    return json(project.toJSON());
  },

  DELETE: async ({ params }) => {
    const { projectId } = params;
    const project = await ProjectModel.findByIdAndDelete(projectId);
    if (!project) {
      return json({ message: "Project not found" }, { status: 404 });
    }
    return json(project.toJSON());
  },
});
