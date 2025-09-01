import {
  Action,
  ActionGroup,
  Button,
  Content,
  Header,
  Heading,
  Label,
  Modal,
  Section,
  Segment,
  SegmentedControl,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useForm } from "react-hook-form";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { FormValues } from "./types.ts";
import { PathsList } from "./components/pathsList.tsx";
import { Domain } from "./components/domain.tsx";
import { createProfile } from "../../actions/profile.ts";
import { Route } from "../../routes/index.js";
import { useGoToProfile } from "../../hooks/useGoTo.js";
import { DomainSelect } from "./components/DomainSelect.js";
import { useState } from "react";

export const CreateModal = () => {
  const goToProfile = useGoToProfile();
  const { contextId } = Route.useSearch();
  const [showCustomDomain, setShowCustomDomain] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      domain: "",
      paths: new Set(["/"]),
    },
  });

  if (!contextId) {
    return null;
  }

  const onSubmit = async (formValues: FormValues) => {
    const profile = await createProfile({
      data: {
        ...formValues,
        name: formValues.domain,
        paths: Array.from(formValues.paths),
        contextId,
      },
    });
    await goToProfile(profile);
    form.reset();
  };

  return (
    <Modal offCanvas>
      <Heading slot="title">Profil anlegen</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Text>
              Wähle eine bestehende Domain aus dem mStudio oder gib eine
              individuelle Domain ein.
            </Text>
            <SegmentedControl
              defaultValue="mstudio"
              onChange={() => setShowCustomDomain(!showCustomDomain)}
            >
              <Label>Domain-Art</Label>
              <Segment value="mstudio">mStudio Domain</Segment>
              <Segment value="custom">Individuelle Eingabe</Segment>
            </SegmentedControl>
            {!showCustomDomain && <DomainSelect />}
            {showCustomDomain && <Domain form={form} />}
            <Header>
              <Heading>Unterseiten hinzufügen</Heading>
              <Text>
                Füge Unterseiten hinzu, um mit einem Scanprofil mehrere Bereiche
                deiner Website im Blick zu behalten.
              </Text>
            </Header>
            <PathsList form={form} autoFocus={!!form.getValues("domain")} />
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Button
              color="secondary"
              variant="soft"
              onPress={() => form.reset()}
            >
              Abbrechen
            </Button>
          </Action>
          <Button color="accent" type="submit">
            Scan starten
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
