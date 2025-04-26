import { createMiddleware } from "@tanstack/react-start";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { notFound } from "@tanstack/react-router";
import { dbConnect, ScanProfileModel } from "extension-a11y-checker-storage";
import { z } from "zod";
import { getHeader } from "@tanstack/react-start/server";
import { verify, getAccessToken } from "@mittwald/ext-bridge/node";
import { getSessionToken } from "@mittwald/ext-bridge/browser";

export const dbMiddleware = createMiddleware()
  .middleware([])
  .server(async ({ next }) => {
    await dbConnect();
    return next();
  });

const getToken = async (sessionToken: string) => {
  const extensionSecret = process.env.EXTENSION_SECRET!;
  console.log("using extensionSecret: ", extensionSecret);

  return (await getAccessToken(sessionToken, extensionSecret)).publicToken;
};

export async function canAccessProject(projectId: string, token: string) {
  const client = MittwaldAPIV2Client.newWithToken(token);
  try {
    const response = await client.project.getProject({
      projectId: projectId,
    });
    return response.status === 200;
  } catch (e) {
    return false;
  }
}

export async function canAccessCustomer(customerId: string, token: string) {
  const client = MittwaldAPIV2Client.newWithToken(token);
  try {
    const response = await client.customer.getCustomer({
      customerId: customerId,
    });
    return response.status === 200;
  } catch (e) {
    return false;
  }
}

export async function canAccessContext(
  type: "project" | "customer",
  contextId: string,
  token: string,
) {
  switch (type) {
    case "project":
      return canAccessProject(contextId, token);
    case "customer":
      return canAccessCustomer(contextId, token);
  }
}

export const authenticateMiddleware = createMiddleware({ validateClient: true })
  .client(async ({ next }) => {
    console.log("trying to get session token");
    const token = await getSessionToken();
    console.log("extBridge session token", token);
    return next({
      headers: { "x-session-token": token },
    });
  })
  .server(async ({ next }) => {
    console.log("validating session token");
    const sessionToken = getHeader("x-session-token");
    console.log("session-token:", sessionToken);
    const verifiedToken = await verify(sessionToken!);
    console.log(verifiedToken);
    console.log("getting API token");
    const apiToken = await getToken(sessionToken!);
    console.log("apiToken", apiToken);

    return next({
      context: {
        contextId: verifiedToken.contextId,
        contextType: verifiedToken.context,
        apiToken,
      },
    });
  });

export const authorizeMiddleware = createMiddleware()
  .middleware([authenticateMiddleware])
  .server(async ({ next, context }) => {
    console.log(JSON.stringify(context));
    const { contextType, contextId, apiToken } = context;

    console.log("checking access to context");
    const canAccess = await canAccessContext(contextType, contextId, apiToken);
    if (!canAccess) {
      throw notFound();
    }
    console.log("access granted");

    return next();
  });

const contextSchema = z
  .object({
    projectId: z.string(),
  })
  .catchall(z.any());

export const contextMatchingMiddleware = createMiddleware()
  .middleware([authorizeMiddleware])
  .validator(contextSchema)
  .server(async ({ next, context, data: { projectId } }) => {
    const { contextId } = context;

    console.log("validating context matching", contextId, projectId);
    if (contextId !== projectId) {
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
  console.log("retrieving profile", profileId);
  const profile = await ScanProfileModel.findById(profileId);
  if (!profile) {
    throw notFound();
  }

  console.log("validating context matching", contextId, profile.project);
  if (contextId !== profile.project) {
    throw notFound();
  }
  console.log("context matches, continuing");
}

export const profileIdAuthorizeMiddleware = createMiddleware()
  .middleware([dbMiddleware, authorizeMiddleware])
  .validator(profileIdSchema)
  .server(async ({ next, context, data: profileId }) => {
    const { contextId } = context;
    await assertContextMatching(profileId, contextId);
    return next();
  });

export const profileAuthorizeMiddleware = createMiddleware()
  .middleware([dbMiddleware, authorizeMiddleware])
  .validator(profileSchema)
  .server(async ({ next, context, data: { profileId } }) => {
    const { contextId } = context;
    await assertContextMatching(profileId, contextId);
    return next();
  });
