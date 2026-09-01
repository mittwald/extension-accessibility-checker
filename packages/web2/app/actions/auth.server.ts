import { getAccessToken, verify } from "@mittwald/ext-bridge/node";

export const verifySessionToken = (sessionToken: string) =>
  verify(sessionToken);

export const verifySession = async (sessionToken: string) => {
  const verifiedToken = await verify(sessionToken);
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
