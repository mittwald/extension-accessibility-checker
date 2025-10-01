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
import { Route } from "../../../../routes/profiles.$profileId.tsx";
import { isRunningOrPending } from "../../helpers.ts";
import { useRouter } from "@tanstack/react-router";
import { startScan } from "../../../../actions/scan.ts";
import { EditIntervalModal } from "../../modals/EditIntervalModal.js";
import { CronText } from "../../CronFields/CronText.js";

export const IntarvallSettings = () => {
  const { profile } = Route.useLoaderData();
  const nextScan = profile.nextScan;
  const router = useRouter();

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
        <Button
          color="accent"
          onPress={async () => {
            await startScan({ data: { profileId: profile._id } });
            await router.invalidate({ sync: true });
          }}
          isDisabled={isRunningOrPending(nextScan)}
        >
          Scan starten
        </Button>
      </Header>
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
