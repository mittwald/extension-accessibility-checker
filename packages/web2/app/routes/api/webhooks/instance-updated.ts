import { json } from "@tanstack/react-start";
import schema from "~/lib/webhook/schemas/instanceUpdated.js";
import { assertContextType } from "~/lib/webhook/helpers.js";
import { ContextModel } from "extension-a11y-checker-storage";
import { assertValidSignature } from "~/lib/webhook/verifySignature.js";
import { logger } from "~/logger";
import { assertValidationSuccess, handleAPIError } from "~/api/helpers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhooks/instance-updated")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          logger.debug("webhook received: instance-updated");
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

          const update = await ContextModel.update(data.context.id);
          if (update.modifiedCount === 0) {
            return json({ message: "Project not found" }, { status: 404 });
          }

          return json({ message: "ok" }, { status: 200 });
        } catch (e) {
          return handleAPIError(e);
        }
      },
    },
  },
});
