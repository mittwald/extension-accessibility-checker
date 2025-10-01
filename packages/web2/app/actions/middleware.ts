import { createMiddleware } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { dbConnect, ScanProfileModel } from "extension-a11y-checker-storage";
import { z } from "zod";
import { getRequestHeader } from "@tanstack/react-start/server";
import { getAccessToken, verify } from "@mittwald/ext-bridge/node";
import { getSessionToken } from "@mittwald/ext-bridge/browser";

export const dbMiddleware = createMiddleware()
  .middleware([])
  .server(async ({ next }) => {
    await dbConnect();
    return next();
  });

const getToken = async (sessionToken: string) => {
  const extensionSecret = process.env.EXTENSION_SECRET!;
  return (await getAccessToken(sessionToken, extensionSecret)).publicToken;
};

export const authenticateMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const token = await getSessionToken();
    return next({
      headers: { "x-session-token": token },
    });
  })
  .server(async ({ next }) => {
    const sessionToken = getRequestHeader("x-session-token");
    const verifiedToken = await verify(sessionToken!);
    const apiToken = await getToken(sessionToken!);

    return next({
      context: {
        contextId: verifiedToken.contextId,
        contextType: verifiedToken.context,
        apiToken,
      },
    });
  });

const contextSchema = z
  .object({
    contextId: z.string(),
  })
  .catchall(z.any());

export const contextMatchingMiddleware = createMiddleware({ type: "function" })
  .middleware([authenticateMiddleware])
  .inputValidator(contextSchema)
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
  .inputValidator(profileIdSchema)
  .server(async ({ next, context, data: profileId }) => {
    const { contextId } = context;
    await assertContextMatching(profileId, contextId);
    return next();
  });

export const profileAuthorizeMiddleware = createMiddleware({ type: "function" })
  .middleware([dbMiddleware, authenticateMiddleware])
  .inputValidator(profileSchema)
  .server(async ({ next, context, data: { profileId } }) => {
    const { contextId } = context;
    await assertContextMatching(profileId, contextId);
    return next();
  });
