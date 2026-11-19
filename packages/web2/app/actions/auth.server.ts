import { getAccessToken, verify } from "@mittwald/ext-bridge/node";
import { isAxiosError } from "axios";

const verifyOptions = () => ({ extensionId: process.env.EXTENSION_ID! });

export const verifySessionToken = (sessionToken: string) =>
  verify(sessionToken, verifyOptions());

export const verifySession = async (sessionToken: string) => {
  const verifiedToken = await verify(sessionToken, verifyOptions());
  const { publicToken } = await getAccessToken(
    sessionToken,
    process.env.EXTENSION_SECRET!,
  ).catch((error: unknown) => {
    if (isAxiosError(error)) {
      console.error("getAccessToken failed", {
        status: error.response?.status,
        body: error.response?.data,
      });
    }
    throw error;
  });

  return {
    contextId: verifiedToken.contextId,
    contextType: verifiedToken.context,
    apiToken: publicToken,
  };
};
