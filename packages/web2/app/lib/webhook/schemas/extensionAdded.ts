import { z } from "zod";

export default z.object({
  apiVersion: z.string(),
  kind: z.literal("ExtensionAddedToContext"),
  id: z.uuid(),
  context: z.object({
    id: z.uuid(),
    kind: z.enum(["customer", "project"]),
  }),
  consentedScopes: z.array(z.string()),
  state: z.object({ enabled: z.boolean().optional() }),
  meta: z.object({
    extensionId: z.uuid(),
    contributorId: z.uuid(),
  }),
  secret: z.string(),
  request: z.object({
    id: z.uuid(),
    createdAt: z.iso.datetime({ offset: true }),
    target: z.object({ method: z.string(), url: z.string().url() }),
  }),
});
