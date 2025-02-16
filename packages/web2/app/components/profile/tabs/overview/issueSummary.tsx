import { ScanProfile } from "../../../../api/types.ts";
import {
  ColumnLayout,
  Content,
  IconDanger,
  IconInfo,
  IconWarning,
  Label,
  LabeledValue,
} from "@mittwald/flow-react-components";

export function IssueSummary({ profile }: { profile: ScanProfile }) {
  return (
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
  );
}
