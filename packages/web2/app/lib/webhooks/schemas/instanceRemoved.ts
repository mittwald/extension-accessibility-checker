import { z } from "zod";

export default z.object({
  apiVersion: z.string(),
  kind: z.literal("InstanceRemovedFromContext"),
  id: z.string().uuid(),
  context: z.object({
    id: z.string().uuid(),
    kind: z.enum(["customer", "project"]),
  }),
  consentedScopes: z.array(z.string()),
  state: z.object({ enabled: z.boolean().optional() }),
  meta: z.object({
    extensionId: z.string().uuid(),
    contributorId: z.string().uuid(),
  }),
  request: z.object({
    id: z.string().uuid(),
    createdAt: z.string().datetime({ offset: true }),
    target: z.object({ method: z.string(), url: z.string().url() }),
  }),
});
