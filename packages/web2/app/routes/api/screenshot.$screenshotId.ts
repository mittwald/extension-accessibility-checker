import { createFileRoute } from "@tanstack/react-router";
import {
  dbConnect,
  ScanModel,
  ScanProfileModel,
  ScreenshotModel,
} from "extension-a11y-checker-storage";

export const Route = createFileRoute("/api/screenshot/$screenshotId")({
  server: {
    handlers: {
      GET: async ({ params: { screenshotId }, request }) => {
        try {
          await dbConnect();
          const sessionToken = request.headers.get("x-session-token");
          if (!sessionToken) {
            return new Response(null, { status: 401 });
          }

          let verifiedToken;
          try {
            const { verifySessionToken } = await import(
              "../../actions/auth.server.js"
            );
            verifiedToken = await verifySessionToken(sessionToken);
          } catch {
            return new Response(null, { status: 401 });
          }

          let screenshot;
          try {
            screenshot = await ScreenshotModel.findById(screenshotId)
              .select("+image")
              .exec();
          } catch (err) {
            if (err instanceof Error && err.name === "CastError") {
              return new Response(null, { status: 404 });
            }
            throw err;
          }

          if (!screenshot) {
            return new Response(null, { status: 404 });
          }

          const scan = await ScanModel.findById(screenshot.scan).exec();
          if (!scan) {
            return new Response(null, { status: 404 });
          }

          const profile = await ScanProfileModel.findById(scan.profile).exec();
          if (
            !profile ||
            verifiedToken.contextId !== profile.context.toString()
          ) {
            return new Response(null, { status: 404 });
          }

          const image = new Uint8Array(
            screenshot.image.buffer,
            screenshot.image.byteOffset,
            screenshot.image.byteLength,
          );

          return new Response(image, {
            status: 200,
            headers: {
              "Content-Type": screenshot.mimeType,
              "Cache-Control": "private, max-age=31536000, immutable",
            },
          });
        } catch (err) {
          console.error("Screenshot Retrieval Error:", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
