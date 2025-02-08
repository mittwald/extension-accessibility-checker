import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { ProjectModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute("/api/projects")({
  GET: async () => {
    const projects = await ProjectModel.find();
    return json(projects);
  },

  POST: async ({ request }) => {
    const input = await request.json();
    const project = await ProjectModel.create(input);
    return json(project.toJSON(), { status: 201 });
  },
});
