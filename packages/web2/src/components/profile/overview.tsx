import { ScanProfile } from "../../api/types.ts";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { LabeledValue } from "@mittwald/flow-react-components/LabeledValue";
import { Label } from "@mittwald/flow-react-components/Label";
import { Content } from "@mittwald/flow-react-components/Content";
import { Heading } from "@mittwald/flow-react-components/Heading";
import {
  IconDanger,
  IconInfo,
  IconWarning,
} from "@mittwald/flow-react-components/Icons";
import { Section } from "@mittwald/flow-react-components/Section";

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
