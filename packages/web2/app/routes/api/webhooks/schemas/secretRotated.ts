import { z } from "zod";

export default z.object({
  apiVersion: z.string(),
  kind: z.literal("SecretRotated"),
  id: z.string().uuid(),
  context: z.object({
    id: z.string().uuid(),
    kind: z.enum(["customer", "project"]),
  }),
  meta: z.object({
    extensionId: z.string().uuid(),
    contributorId: z.string().uuid(),
  }),
  secret: z.string(),
  request: z.object({
    id: z.string().uuid(),
    createdAt: z.string().datetime({ offset: true }),
    target: z.object({ method: z.string(), url: z.string().url() }),
  }),
});
