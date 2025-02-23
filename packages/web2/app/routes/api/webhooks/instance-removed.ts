import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import {
  assertContextType,
  assertValidationSuccess,
  handleAPIError,
} from "./_helpers.js";
import schema from "./schemas/instanceRemoved.js";
import { ProjectModel } from "extension-a11y-checker-storage";
import { assertValidSignature } from "./_verifySignature.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/instance-removed")({
  POST: async ({ request }) => {
    try {
      console.log("webhook received: instance-removed");
      await assertValidSignature(request);

      const parseResult = await schema.safeParseAsync(await request.json());
      assertValidationSuccess(parseResult);

      const { data } = parseResult;
      assertContextType(data.context);

      await ProjectModel.delete(data.context.id);

      return json({ message: "ok" }, { status: 200 });
    } catch (e) {
      return handleAPIError(e);
    }
  },
});
