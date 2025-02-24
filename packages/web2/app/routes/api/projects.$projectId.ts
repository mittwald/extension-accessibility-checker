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
});
