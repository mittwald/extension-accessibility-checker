import { json } from "@tanstack/react-start";

import { assertValidSignature } from "~/lib/webhook/verifySignature.js";
import { createFileRoute } from "@tanstack/react-router";

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
