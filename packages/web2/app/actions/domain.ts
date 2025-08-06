import { createServerFn } from "@tanstack/react-start";
import { authenticateMiddleware } from "./middleware.js";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";

export const getDomains = createServerFn({
  method: "GET",
})
  .middleware([authenticateMiddleware])
  .handler(async ({ context }) => {
    const client = MittwaldAPIV2Client.newWithToken(context.apiToken);
    const domains = await client.domain.ingressListIngresses({});
    assertStatus(domains, 200);
    return domains.data;
  });
