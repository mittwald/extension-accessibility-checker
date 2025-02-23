import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import schema from "./schemas/instanceUpdated.js";
import {
  assertContextType,
  assertValidationSuccess,
  handleAPIError,
} from "./_helpers.js";
import { ProjectModel } from "extension-a11y-checker-storage";

export const APIRoute = createAPIFileRoute("/api/webhooks/instance-updated")({
  POST: async ({ request }) => {
    try {
      console.log("webhook received: instance-updated");

      const parseResult = await schema.safeParseAsync(await request.json());
      assertValidationSuccess(parseResult);

      const { data } = parseResult;
      assertContextType(data.context);

      const update = await ProjectModel.update(data.context.id);
      if (update.modifiedCount === 0) {
        return json({ message: "Project not found" }, { status: 404 });
      }

      return json({ message: "ok" }, { status: 200 });
    } catch (e) {
      return handleAPIError(e);
    }
  },
});
