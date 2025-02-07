import { ScanProfile } from "../../api/types.ts";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import {
  IconDanger,
  IconInfo,
  IconWarning,
} from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";

export const Overview = ({ profile }: { profile: ScanProfile }) => {
  return (
    <Section>
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
