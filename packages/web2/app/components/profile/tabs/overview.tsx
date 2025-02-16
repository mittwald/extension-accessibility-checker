import { ScanProfile } from "../../../api/types.ts";
import {
  ColumnLayout,
  Content,
  Heading,
  IconDanger,
  IconInfo,
  IconWarning,
  Label,
  LabeledValue,
  Section,
} from "@mittwald/flow-react-components";
import { CurrentScan } from "../currentScan.tsx";

export const Overview = ({ profile }: { profile: ScanProfile }) => {
  return (
    <Section>
      <CurrentScan />
      <Heading>Übersicht</Heading>
      <ColumnLayout>
        <LabeledValue>
          <Label>
            <IconDanger /> Fehler
          </Label>
          <Content>{profile.issueSummary?.errors}</Content>
        </LabeledValue>
        <LabeledValue>
          <Label>
            <IconWarning /> Warnungen
          </Label>
          <Content>{profile.issueSummary?.warnings}</Content>
        </LabeledValue>
        <LabeledValue>
          <Label>
            <IconInfo /> Hinweise
          </Label>
          <Content>{profile.issueSummary?.notices}</Content>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  );
};
