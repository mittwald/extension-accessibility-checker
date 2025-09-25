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
import { EditGeneralsModal } from "../../modals/editGenerals.tsx";
import { WcagStandardContextualHelp } from "../../wcagStandardContextualHelp.js";
import { SaveResourcesBanner } from "./components/saveResourcesBanner.tsx";
import { hasDailyCronInterval } from "../../../../lib/hasDailyCronInterval.ts";

export const GeneralSettings = () => {
  const { profile } = Route.useLoaderData();

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
      {hasDailyCronInterval(profile) && (
        <SaveResourcesBanner profile={profile} />
      )}
      <ColumnLayout>
        <LabeledValue>
          <Label>Domain</Label>
          <Content>{profile.domain}</Content>
        </LabeledValue>
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
