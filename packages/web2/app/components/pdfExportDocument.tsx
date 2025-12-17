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
import InterRegular from '../../assets/fonts/Inter-Regular.ttf';
import InterBold from '../../assets/fonts/Inter-Bold.ttf';
import BlueHeart from './assets/emojis/2764.png';

interface Props {
  profile: ScanProfileWithSuccessfulScan;
}

Font.registerEmojiSource({
  format: 'png',
  builder: (codePoint: string): string => {
    // saved to disk to avoid unnecesarry network calls since it is always needed
    if (codePoint === '1f499') {
      return BlueHeart;
    }

    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@16.0.0/img/apple/64/${codePoint}.png`;
  },
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: InterRegular, fontWeight: 400 },
    { src: InterBold, fontWeight: 700 },
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
