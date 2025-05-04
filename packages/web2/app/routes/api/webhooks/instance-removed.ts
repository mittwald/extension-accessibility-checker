import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { assertContextType } from "./_helpers.js";
import schema from "./schemas/instanceRemoved.js";
import { ContextModel } from "extension-a11y-checker-storage";
import { assertValidSignature } from "./_verifySignature.js";
import { logger } from "../../../logger.js";
import {
  assertValidationSuccess,
  handleAPIError,
} from "../../../api/helpers.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/instance-removed")({
  POST: async ({ request }) => {
    try {
      logger.debug("webhook received: instance-removed");
      await assertValidSignature(request);

      const parseResult = await schema.safeParseAsync(await request.json());
      assertValidationSuccess(parseResult);

      const { data } = parseResult;
      assertContextType(data.context);

      await ContextModel.delete(data.context.id);

      return json({ message: "ok" }, { status: 200 });
    } catch (e) {
      return handleAPIError(e);
    }
  },
});
