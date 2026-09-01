import { createMiddleware } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { dbConnect, ScanProfileModel } from "extension-a11y-checker-storage";
import { z } from "zod";
import { getRequestHeader } from "@tanstack/react-start/server";
import { getSessionToken } from "@mittwald/ext-bridge/browser";

export const dbMiddleware = createMiddleware({ type: "function" })
  .middleware([])
  .server(async ({ next }) => {
    await dbConnect();
    return next();
  });

export const authenticateMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const token = await getSessionToken();
    return next({
      headers: { "x-session-token": token },
    });
  })
  .server(async ({ next }) => {
    const sessionToken = getRequestHeader("x-session-token");
    const { verifySession } = await import("./auth.server.js");

    return next({
      context: await verifySession(sessionToken!),
    });
  });

const contextSchema = z
  .object({
    contextId: z.string(),
  })
  .catchall(z.any());

export const contextMatchingMiddleware = createMiddleware({ type: "function" })
  .middleware([authenticateMiddleware])
  .validator(contextSchema)
  .server(async ({ next, context, data: { contextId } }) => {
    if (context.contextId !== contextId) {
      throw notFound();
    }
    return next();
  });

const profileIdSchema = z.string();
const profileSchema = z
  .object({
    profileId: profileIdSchema,
  })
  .catchall(z.any());

async function assertContextMatching(profileId: string, contextId: string) {
  const profile = await ScanProfileModel.findById(profileId);
  if (!profile) {
    throw notFound();
  }

  if (contextId !== profile.context) {
    throw notFound();
  }
}

export const profileIdAuthorizeMiddleware = createMiddleware({
  type: "function",
})
  .middleware([dbMiddleware, authenticateMiddleware])
  .validator(profileIdSchema)
  .server(async ({ next, context, data: profileId }) => {
    const { contextId } = context;
    await assertContextMatching(profileId, contextId);
    return next();
  });

export const profileAuthorizeMiddleware = createMiddleware({
  type: "function",
})
  .middleware([dbMiddleware, authenticateMiddleware])
  .validator(profileSchema)
  .server(async ({ next, context, data: { profileId } }) => {
    const { contextId } = context;
    await assertContextMatching(profileId, contextId);
    return next();
  });
