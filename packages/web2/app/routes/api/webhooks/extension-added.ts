import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import schema from "./schemas/extensionAdded.js";
import { ProjectModel } from "extension-a11y-checker-storage";
import {
  assertContextType,
  assertValidationSuccess,
  handleAPIError,
} from "./_helpers.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/extension-added")({
  POST: async ({ request }) => {
    try {
      console.log("webhook received: extension-added");

      const parseResult = await schema.safeParseAsync(await request.json());
      assertValidationSuccess(parseResult);

      const { data } = parseResult;
      assertContextType(data.context);
      await ProjectModel.instanceAdded(data.context.id);

      return json({ message: "ok" }, { status: 201 });
    } catch (e) {
      return handleAPIError(e);
    }
  },
});
