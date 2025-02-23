import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

import { assertValidSignature } from "./_verifySignature.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/secret-rotated")({
  POST: async ({ request }) => {
    await assertValidSignature(request);
    return json({ message: "ok" }, { status: 200 });
  },
});
