import { FC } from "react";
import { Document, Font } from "@react-pdf/renderer";
import { ScanProfileWithSuccessfulScan } from "../api/types";
import PdfFrontPage from "./pdf/pages/frontPage";
import PdfResultOverviewPage from "./pdf/pages/resultOverviewPage";
import PdfScannedPagesPage from "./pdf/pages/scannedPagesPage";
import {
  getIssueMeta,
  groupIssuesByGuidelineAndTechnique,
} from "./profile/tabs/issues/helpers";
import wcagLinks from "../wcagLinks.json";
import IssueDetailsPage from "./pdf/pages/issueDetailsPage";
import SummaryPage from "./pdf/pages/summaryPage";
import BenefitsPage from "./pdf/pages/benefitsPage";
import ClosingPage from "./pdf/pages/closingPage";
import MethodologyPage from "./pdf/pages/methodologyPage";

interface Props {
  profile: ScanProfileWithSuccessfulScan;
}

Font.registerEmojiSource({
  format: "png",
  url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/",
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.bunny.net/inter/files/inter-latin-600-normal.woff",
      fontWeight: 600,
    },
  ],
});

export const PdfExportDocument: FC<Props> = ({ profile }) => {
  const preparedIssues = (profile.lastSuccessfulScan?.issues ?? [])
    .filter((issue) => {
      const meta = getIssueMeta(issue);
      const wcagData = wcagLinks[meta.criterion];
      return !wcagData || !("wcagLevel" in wcagData) || true;
    })
    .sort((a, b) => {
      const order = {
        error: 0,
        warning: 1,
        notice: 2,
      };
      return order[a.severity] - order[b.severity];
    });

  const issueGroups = groupIssuesByGuidelineAndTechnique(preparedIssues ?? []);

  return (
    <Document>
      <PdfFrontPage profile={profile} />
      <PdfResultOverviewPage profile={profile} />
      <PdfScannedPagesPage profile={profile} />
      {issueGroups
        .sort((a, b) => a.groupKey.localeCompare(b.groupKey))
        .map((group, index) => (
          <IssueDetailsPage key={index} group={group} index={index} />
        ))}
      <SummaryPage issueGroups={issueGroups} />
      <BenefitsPage />
      <MethodologyPage />
      <ClosingPage profile={profile} />
    </Document>
  );
};
