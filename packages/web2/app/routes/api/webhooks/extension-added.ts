import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import schema from "./schemas/extensionAdded.js";
import { ContextModel } from "extension-a11y-checker-storage";
import { assertContextType } from "./_helpers.js";
import { assertValidSignature } from "./_verifySignature.js";
import { logger } from "../../../logger.js";
import {
  assertValidationSuccess,
  handleAPIError,
} from "../../../api/helpers.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/extension-added")({
  POST: async ({ request }) => {
    try {
      logger.debug("webhook received: extension-added");
      await assertValidSignature(request);

      const parseResult = await schema.safeParseAsync(await request.json());
      assertValidationSuccess(parseResult);

      const { data } = parseResult;
      assertContextType(data.context);
      await ContextModel.instanceAdded(data.context.id);

      return json({ message: "ok" }, { status: 201 });
    } catch (e) {
      return handleAPIError(e);
    }
  },
});
