import { ScanProfile } from "../../../../api/types.ts";
import {
  Header,
  Heading,
  Label,
  ProgressBar,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { PdfDownloadButton } from "./pdfDownloadButton";

export function A11yScore({ profile }: { profile: ScanProfile }) {
  const color = (value: number | undefined) => {
    if (value === undefined) {
      return undefined;
    }
    if (value < 50) {
      return "danger";
    }
    if (value < 90) {
      return "warning";
    }
    return "success";
  };

  return (
    <Section>
      <Header>
        <Heading>Scanergebnis</Heading>
        <PdfDownloadButton profileId={profile._id} />
      </Header>
      <Text>
        Der Barrierefreiheitsscore vermittelt einen groben Eindruck.
        Entscheidend ist die Anzahl und Art von Fehlern, Warnungen und
        Hinweisen, die geprüft und behoben werden müssen.
      </Text>
      <ProgressBar
        value={profile.issueSummary?.score}
        maxValue={100}
        showMaxValue
        status={color(profile.issueSummary?.score)}
        formatOptions={{ style: "decimal" }}
      >
        <Label>Barrierefreiheitsscore</Label>
      </ProgressBar>
    </Section>
  );
}
