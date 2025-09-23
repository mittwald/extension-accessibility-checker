import {
  Button,
  ColumnLayout,
  Content,
  // ContextualHelp,
  ContextualHelpTrigger,
  Header,
  Heading,
  Label,
  LabeledValue,
  ModalTrigger,
  Section,
  // Text,
} from "@mittwald/flow-remote-react-components";
import { Route } from "../../../../routes/profiles.$profileId.tsx";
import { EditGeneralsModal } from "../../modals/editGenerals.tsx";
// import { useRouter } from "@tanstack/react-router";
import { WcagStandardContextualHelp } from "../../wcagStandardContextualHelp.js";
// import { CronText } from "../../CronFields/CronText.js";

export const GeneralSettings = () => {
  const { profile } = Route.useLoaderData();
  // const nextScan = profile.nextScan;
  // const router = useRouter();

  // const nextExecution = nextScan?.executionScheduledFor;

  return (
    <Section>
      <Header>
        <Heading>Scan-Profil</Heading>
        <ModalTrigger>
          <Button color="secondary" variant="soft">
            Bearbeiten
          </Button>
          <EditGeneralsModal profile={profile} />
        </ModalTrigger>
      </Header>
      <ColumnLayout>
        <LabeledValue>
          <Label>Domain</Label>
          <Content>{profile.domain}</Content>
        </LabeledValue>
        {/* {profile.cronSchedule && (
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
        )} */}
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
          <Label>Hinweise</Label>
          <Content>
            {profile.includeNotices ? "aktiviert" : "deaktiviert"}
          </Content>
        </LabeledValue>
        <LabeledValue>
          <Label>Warnungen</Label>
          <Content>
            {profile.includeWarnings ? "aktiviert" : "deaktiviert"}
          </Content>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  );
};
