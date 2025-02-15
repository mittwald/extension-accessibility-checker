import {
  Button,
  ColumnLayout,
  Content,
  ContextualHelp,
  ContextualHelpTrigger,
  Header,
  Heading,
  Label,
  LabeledValue,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { Route } from "../../../routes/profiles.$profileId.tsx";
import { startScan } from "../../../actions.ts";
import { EditGeneralsModal } from "../modals/editGenerals.tsx";
import { isPending, isRunning } from "../helpers.ts";
import { useRouter } from "@tanstack/react-router";

export const GeneralSettings = () => {
  const { profile, nextScan } = Route.useLoaderData();
  const router = useRouter();

  const nextExecution = nextScan
    ? new Date(nextScan?.executionScheduledFor)
    : null;

  return (
    <Section>
      <Header>
        <Heading>Generelle Einstellungen</Heading>
        <ModalTrigger>
          <Button color="secondary" variant="soft">
            Bearbeiten
          </Button>
          <EditGeneralsModal profile={profile} />
        </ModalTrigger>
        <Button
          color="accent"
          onPress={async () => {
            await startScan({ data: profile._id });
            await router.invalidate({ sync: true });
          }}
          isDisabled={nextScan && (isRunning(nextScan) || isPending(nextScan))}
        >
          Scan starten
        </Button>
      </Header>
      <ColumnLayout>
        <LabeledValue>
          <Label>Domain</Label>
          <Content>{profile.domain}</Content>
        </LabeledValue>
        {profile.cronSchedule && (
          <>
            <LabeledValue>
              <Label>Ausführungsintervall</Label>
              <Content>{profile.cronSchedule?.expression}</Content>
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
              <Content>{nextExecution?.toLocaleString()}</Content>
            </LabeledValue>
          </>
        )}
        <LabeledValue>
          <Label>Warnungen</Label>
          <Content>
            {profile.includeWarnings ? "aktiviert" : "deaktiviert"}
          </Content>
        </LabeledValue>
        <LabeledValue>
          <Label>Hinweise</Label>
          <Content>
            {profile.includeNotices ? "aktiviert" : "deaktiviert"}
          </Content>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  );
};
