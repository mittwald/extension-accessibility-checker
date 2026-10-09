import {
  Button,
  ColumnLayout,
  Content,
  ContextualHelpTrigger,
  Header,
  Heading,
  Label,
  LabeledValue,
  ModalTrigger,
  Section,
  ContextualHelp,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useProfileData } from "../../../../hooks/useProfileData.tsx";
import { EditIntervalModal } from "../../modals/EditIntervalModal.js";
import { CronText } from "../../CronFields/CronText.js";
import { SaveResourcesBanner } from "./components/saveResourcesBanner.tsx";
import { hasDailyCronInterval } from "../../../../lib/hasDailyCronInterval.ts";
import { StartScanButton } from "./components/StartScanButton.tsx";

export const IntarvallSettings = () => {
  const { profile } = useProfileData();
  const nextScan = profile.nextScan;

  const nextExecution = nextScan?.executionScheduledFor;

  return (
    <Section>
      <Header>
        <Heading>Intervall</Heading>
        <ModalTrigger>
          <Button color="secondary" variant="soft">
            Bearbeiten
          </Button>
          <EditIntervalModal profile={profile} />
        </ModalTrigger>
        <StartScanButton profile={profile} />
      </Header>
      {hasDailyCronInterval(profile) && (
        <SaveResourcesBanner profile={profile} />
      )}
      <ColumnLayout>
        {profile.cronSchedule ? (
          <>
            <LabeledValue>
              <Label>Intervall</Label>
              <Content>
                <CronText cronSyntax={profile.cronSchedule.expression} />
              </Content>
            </LabeledValue>

            <LabeledValue>
              <Label>
                Nächste Ausführung
                <ContextualHelpTrigger>
                  <Button />
                  <ContextualHelp>
                    <Heading>Nächste Ausführung</Heading>
                    <Text>
                      Bitte beachte, dass sich die tatsächliche Ausführung um
                      einige Sekunden verzögern kann.
                    </Text>
                  </ContextualHelp>
                </ContextualHelpTrigger>
              </Label>

              <Content>{nextExecution?.toLocaleString() ?? "–"}</Content>
            </LabeledValue>
          </>
        ) : (
          <LabeledValue>
            <Label>Intervall</Label>
            <Content>Manuelle Ausführung</Content>
          </LabeledValue>
        )}
      </ColumnLayout>
    </Section>
  );
};
