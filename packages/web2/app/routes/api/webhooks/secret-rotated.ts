import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

import { assertValidSignature } from "./_verifySignature.js";

export const APIRoute = createAPIFileRoute("/api/webhooks/secret-rotated")({
  POST: async ({ request }) => {
    await assertValidSignature(request);
    return json({ message: "ok" }, { status: 200 });
  },
});
