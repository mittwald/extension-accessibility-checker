import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

import { assertValidSignature } from "../../../lib/webhooks/verifySignature.js";

export const Route = createFileRoute("/api/webhooks/secret-rotated")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await assertValidSignature(request);
        return json({ message: "ok" }, { status: 200 });
      },
    },
  },
});
