import { WebhookVerifier } from "@weissaufschwarz/mitthooks/verification/verify";
import {
  APIPublicKeyProvider,
  CachingPublicKeyProvider,
} from "@weissaufschwarz/mitthooks/verification/publicKeys";
import { WebhookContent } from "@weissaufschwarz/mitthooks/webhook";
import { json } from "@tanstack/react-start";

class SignatureVerifier {
  private static verifier = new WebhookVerifier(
    {
      error: console.error,
      debug: console.debug,
      info: console.info,
    },
    new CachingPublicKeyProvider(
      APIPublicKeyProvider.newWithUnauthenticatedAPIClient(
        process.env.MITTWALD_KEY_PROVIDER_API_URL,
      ),
    ),
  );

  public static async verify(content: WebhookContent): Promise<boolean> {
    return await this.verifier.verify(content);
  }
}

export const assertValidSignature = async (request: Request) => {
  const serial = request.headers.get("X-Marketplace-Signature-Serial");
  const algorithm = request.headers.get("X-Marketplace-Signature-Algorithm");
  const signature = request.headers.get("X-Marketplace-Signature");
  const rawBody = await request.clone().text();

  if (!serial || !algorithm || !signature) {
    throw json({ message: "Missing signature headers" }, { status: 400 });
  }

  const content: WebhookContent = {
    signature,
    signatureSerial: serial,
    signatureAlgorithm: algorithm,
    rawBody,
  };
  const signatureIsValid = await SignatureVerifier.verify(content);

  if (!signatureIsValid) {
    throw json({ message: "Invalid signature" }, { status: 400 });
  }
};
