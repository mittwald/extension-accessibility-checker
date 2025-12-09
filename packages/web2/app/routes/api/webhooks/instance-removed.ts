import { json } from "@tanstack/react-start";
import { assertContextType } from "~/lib/webhook/helpers.js";
import schema from "~/lib/webhook/schemas/instanceRemoved.js";
import { ContextModel } from "extension-a11y-checker-storage";
import { assertValidSignature } from "~/lib/webhook/verifySignature.js";
import { logger } from "~/logger";
import { assertValidationSuccess, handleAPIError } from "~/api/helpers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhooks/instance-removed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          logger.debug("webhook received: instance-removed");
          await assertValidSignature(request);

          const parseResult = await schema.safeParseAsync(await request.json());
          assertValidationSuccess(parseResult);

          const { data } = parseResult;
          if (!data)
            return json(
              { message: "failed to parse request" },
              { status: 500 },
            );
          assertContextType(data.context);

          await ContextModel.delete(data.context.id);

          return json({ message: "ok" }, { status: 200 });
        } catch (e) {
          return handleAPIError(e);
        }
      },
    },
  },
});
