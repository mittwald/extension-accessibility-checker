import { renderToStream } from "@react-pdf/renderer";
import { PdfExportDocument } from "../components/pdfExportDocument";
import { ScanProfile } from "../api/types";

export async function renderProfilePdf(profile: ScanProfile) {
  return await renderToStream(<PdfExportDocument profile={profile} />);
}
