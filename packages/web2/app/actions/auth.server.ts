import { getAccessToken, verify } from "@mittwald/ext-bridge/node";

const verifyOptions = () => ({ extensionId: process.env.EXTENSION_ID! });

export const verifySessionToken = (sessionToken: string) =>
  verify(sessionToken, verifyOptions());

export const verifySession = async (sessionToken: string) => {
  const verifiedToken = await verify(sessionToken, verifyOptions());
  const { publicToken } = await getAccessToken(
    sessionToken,
    process.env.EXTENSION_SECRET!,
  );

  return {
    contextId: verifiedToken.contextId,
    contextType: verifiedToken.context,
    apiToken: publicToken,
  };
};
