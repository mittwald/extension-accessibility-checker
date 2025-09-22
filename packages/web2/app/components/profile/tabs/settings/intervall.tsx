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
} from "@mittwald/flow-remote-react-components";
import { Route } from "../../../../routes/profiles.$profileId.tsx";
import { isRunningOrPending } from "../../helpers.ts";
import { useRouter } from "@tanstack/react-router";
import { startScan } from "../../../../actions/scan.ts";
import { WcagStandardContextualHelp } from "../../wcagStandardContextualHelp.js";
import { EditIntervalModal } from "../../modals/EditIntervalModal.js";

export const IntarvallSettings = () => {
  const { profile } = Route.useLoaderData();
  const nextScan = profile.nextScan;
  const router = useRouter();
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
        <LabeledValue>
          <Label>Intervall</Label>
          <Content>---</Content>
        </LabeledValue>
        <LabeledValue>
          <Label>
            Nächste Ausführung
            <ContextualHelpTrigger>
              <Button />
              <WcagStandardContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <Content>---</Content>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  );
};
