import { createFileRoute, notFound } from "@tanstack/react-router";
import { renderProfilePdf } from "../../lib/renderProfilePdf";
import {
  dbConnect,
  Scan,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { ScanProfile } from "../../api/types";

export const Route = createFileRoute("/api/pdf-export/$profileId")({
  server: {
    handlers: {
      GET: async ({ params: { profileId }, request }) => {
        try {
          await dbConnect();
          const sessionToken = request.headers.get("x-session-token");
          const { verifySessionToken } = await import(
            "../../actions/auth.server.js"
          );
          const verifiedToken = await verifySessionToken(sessionToken!);

          const profile = await ScanProfileModel.findById(profileId).exec();
          if (!profile) {
            throw notFound();
          }
          if (verifiedToken.contextId !== profile.context) {
            throw notFound();
          }
          await profile?.populate("nextScan");
          const lastScan = await ScanModel.lastScanOfProfile(profileId);
          const lastSuccessfulScan =
            await ScanModel.lastSuccessfulScanOfProfile(profileId);
          const reportScan = lastSuccessfulScan ?? lastScan;

          const profileResult = {
            ...profile?.toObject(),
            issueSummary: reportScan?.getIssueSummary(),
            lastScan: lastScan as unknown as Scan | undefined,
            lastSuccessfulScan: lastSuccessfulScan as unknown as
              | Scan
              | undefined,
          } as unknown as ScanProfile & {
            lastSuccessfulScan?: Scan;
          };

          const stream = await renderProfilePdf(profileResult);

          return new Response(stream as unknown as BodyInit, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="Barriere-Report.pdf"`,
            },
          });
        } catch (err) {
          console.error("PDF Generation Error:", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
