import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/webhooks/secret-rotated")({
  POST: ({}) => {
    return json({ message: "ok" }, { status: 200 });
  },
});
