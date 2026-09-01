import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import schema from "../../../lib/webhooks/schemas/extensionAdded.js";
import { ContextModel } from "extension-a11y-checker-storage";
import { assertContextType } from "../../../lib/webhooks/helpers.js";
import { assertValidSignature } from "../../../lib/webhooks/verifySignature.js";
import { logger } from "../../../logger.js";
import {
  assertValidationSuccess,
  handleAPIError,
} from "../../../api/helpers.js";

export const Route = createFileRoute("/api/webhooks/extension-added")({
  server: {
    handlers: {
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
    },
  },
});
