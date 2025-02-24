import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { ProjectModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute("/api/projects")({
  GET: async () => {
    // TODO: retrieve projects list from mStudio and return only matching
    const projects = await ProjectModel.find();
    return json(projects);
  },
});
