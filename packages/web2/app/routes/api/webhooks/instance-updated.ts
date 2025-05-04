import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import schema from "./schemas/instanceUpdated.js";
import { assertContextType } from "./_helpers.js";
import { ContextModel } from "extension-a11y-checker-storage";
import { assertValidSignature } from "./_verifySignature.js";
import { logger } from "../../../logger.js";
import {
  assertValidationSuccess,
  handleAPIError,
} from "../../../api/helpers.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/instance-updated")({
  POST: async ({ request }) => {
    try {
      logger.debug("webhook received: instance-updated");
      await assertValidSignature(request);

      const parseResult = await schema.safeParseAsync(await request.json());
      assertValidationSuccess(parseResult);

      const { data } = parseResult;
      assertContextType(data.context);

      const update = await ContextModel.update(data.context.id);
      if (update.modifiedCount === 0) {
        return json({ message: "Project not found" }, { status: 404 });
      }

      return json({ message: "ok" }, { status: 200 });
    } catch (e) {
      return handleAPIError(e);
    }
  },
});
