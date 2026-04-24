import { FC } from "react";
import hyphenDe from "hyphen/de";
const { hyphenateSync: hyphenateDE } = hyphenDe;
import { Document, Font } from "@react-pdf/renderer";
import { ScanProfileWithSuccessfulScan } from "../api/types";
import PdfFrontPage from "./pdf/pages/frontPage";
import PdfResultOverviewPage from "./pdf/pages/resultOverviewPage";
import {
  getIssueMeta,
  groupIssuesByPrincipleAndTechnique,
} from "./profile/tabs/issues/helpers";
import wcagLinks from "../wcagLinks.json";
import PdfIssueDetailsPage from "./pdf/pages/issueDetailsPage";
import PdfSummaryPage from "./pdf/pages/summaryPage";
import PdfClosingPage from "./pdf/pages/closingPage";
import PdfMethodologyPage from "./pdf/pages/methodologyPage";
import path from "node:path";

interface Props {
  profile: ScanProfileWithSuccessfulScan;
}

Font.register({
  family: "Inter",
  fonts: [
    {
      src: path.resolve(
        import.meta.dirname,
        "../../assets/fonts/Inter-Regular.ttf",
      ),
      fontWeight: 400,
    },
    {
      src: path.resolve(
        import.meta.dirname,
        "../../assets/fonts/Inter-Bold.ttf",
      ),
      fontWeight: 700,
    },
  ],
});

Font.registerEmojiSource({
  format: "png",
  builder: (codePoint: string): string => {
    // saved to disk to avoid unnecesarry network calls since it is always needed
    if (codePoint === "1f499") {
      return path.resolve(import.meta.dirname, "../../assets/emojis/1f499.png");
    }

    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.1/img/apple/64/${codePoint}.png`;
  },
});

Font.registerHyphenationCallback((word) => {
  if (word.length > 5) {
    return hyphenateDE(word).split("\u00AD");
  }
  return [word];
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

  const issueGroups = groupIssuesByPrincipleAndTechnique(preparedIssues ?? []);
  const sortedIssueGroups = [...issueGroups].sort((a, b) =>
    a.groupKey.localeCompare(b.groupKey),
  );

  return (
    <Document>
      <PdfFrontPage profile={profile} />
      <PdfResultOverviewPage profile={profile} />
      <PdfIssueDetailsPage groups={sortedIssueGroups} />
      <PdfSummaryPage profile={profile} issueGroups={issueGroups} />
      <PdfMethodologyPage />
      <PdfClosingPage profile={profile} />
    </Document>
  );
};
