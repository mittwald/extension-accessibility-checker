import {
  Alert,
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
} from "@mittwald/flow-remote-react-components";
import { Route } from "../../../../routes/profiles.$profileId.tsx";
import { EditGeneralsModal } from "../../modals/editGenerals.tsx";
import { isRunningOrPending } from "../../helpers.ts";
import { useRouter } from "@tanstack/react-router";
import { startScan } from "../../../../actions/scan.ts";
import { WcagStandardContextualHelp } from "../../wcagStandardContextualHelp.js";
import { EditIntervalModal } from "../../modals/EditIntervalModal.js";
import { CronText } from "../../CronFields/CronText.js";

export const GeneralSettings = () => {
  const { profile } = Route.useLoaderData();
  const nextScan = profile.nextScan;
  const router = useRouter();

  const nextExecution = nextScan?.executionScheduledFor;

  return (
    <Section>
      <Header>
        <Heading>Generelle Einstellungen</Heading>
        <ModalTrigger>
          <Button color="secondary" variant="soft">
            Intervall bearbeiten
          </Button>
          <EditIntervalModal profile={profile} />
        </ModalTrigger>
        <ModalTrigger>
          <Button color="secondary" variant="soft">
            Bearbeiten
          </Button>
          <EditGeneralsModal profile={profile} />
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
      <Alert>
        <Heading>Gemeinsam Ressourcen sparen</Heading>
        <Content>
          Seit dem 06.08.2025 ist der automatische Tages-Check für neue Profile deaktiviert, um den ökologischen Fußabdruck zu senken. Bitte prüfe, ob dieses Profil weiterhin ein tägliches Intervall braucht und passe die Einstellung bei Bedarf an.
        </Content>
        <ModalTrigger>
          <Button color="primary" variant="solid" size="s">
            Intervall bearbeiten
          </Button>
          <EditIntervalModal profile={profile} />
        </ModalTrigger>
      </Alert>
      <ColumnLayout>
        <LabeledValue>
          <Label>Domain</Label>
          <Content>{profile.domain}</Content>
        </LabeledValue>
        {profile.cronSchedule && (
          <>
            <LabeledValue>
              <Label>Ausführungsintervall</Label>
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
        )}
        <LabeledValue>
          <Label>
            Konformitätsstufe
            <ContextualHelpTrigger>
              <Button />
              <WcagStandardContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <Content>{profile.standard}</Content>
        </LabeledValue>
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
