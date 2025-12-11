import { createAPIFileRoute } from "@tanstack/react-start/api";
import { renderProfilePdf } from "../../lib/renderProfilePdf";
import {
  dbConnect,
  Scan,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { ScanProfile } from "../../api/types";
import { notFound } from "@tanstack/react-router";
import { verify } from "@mittwald/ext-bridge/node";

export const APIRoute = createAPIFileRoute("/api/pdf-export/$profileId")({
  GET: async ({ params: { profileId }, request }) => {
    try {
      await dbConnect();
      const sessionToken = request.headers.get("x-session-token");
      const verifiedToken = await verify(sessionToken!);

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

      const profileResult = {
        ...profile?.toObject(),
        issueSummary: lastScan?.getIssueSummary(),
        lastScan: lastScan as unknown as Scan | undefined,
        lastSuccessfulScan: lastSuccessfulScan as unknown as Scan | undefined,
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
});
