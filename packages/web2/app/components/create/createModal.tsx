import {
  Action,
  ActionGroup,
  Button,
  Content,
  Header,
  Heading,
  Modal,
  Section,
  Tab,
  Tabs,
  TabTitle,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useForm } from "react-hook-form";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { FormValues } from "./types.ts";
import { PathsList } from "./components/pathsList.tsx";
import { createProfile } from "../../actions/profile.ts";
import { Route } from "../../routes/index.js";
import { useGoToProfile } from "../../hooks/useGoTo.js";
import { DomainSelect } from "./components/DomainSelect.js";
import { useState } from "react";
import { Domain } from "./components/domain.tsx";
import {
  GenerateError,
  GeneratePathsAction,
} from "../generatePaths/generatePaths.tsx";
import { GenerateErrorAlert } from "../generatePaths/GenerateErrorAlert.tsx";

export const CreateModal = () => {
  const goToProfile = useGoToProfile();
  const { contextId } = Route.useSearch();
  const [generateError, setGenerateError] = useState<GenerateError | null>(
    null,
  );

  const defaultValues = {
    domain: "",
    paths: ["/"],
  };

  const form = useForm<FormValues>({ defaultValues });

  if (!contextId) {
    return null;
  }

  const onSubmit = async (formValues: FormValues) => {
    const profile = await createProfile({
      data: {
        ...formValues,
        name: formValues.domain,
        paths: formValues.paths,
        contextId,
      },
    });
    await goToProfile(profile);
    form.reset(defaultValues);
  };

  return (
    <Modal offCanvas>
      <Heading slot="title">Scanprofil anlegen</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Text>
              Wähle eine bestehende Domain aus dem mStudio oder gib eine
              individuelle Domain ein.
            </Text>
            <Tabs>
              <Tab id="mstudio">
                <TabTitle>mStudio Domain</TabTitle>
                <DomainSelect />
              </Tab>
              <Tab id="custom">
                <TabTitle>Individuelle Eingabe</TabTitle>
                <Domain />
              </Tab>
            </Tabs>
            <Header>
              <Heading>Unterseiten hinzufügen</Heading>
              <GeneratePathsAction
                onError={setGenerateError}
                onSuccess={() => setGenerateError(null)}
              />
            </Header>
            {generateError && (
              <GenerateErrorAlert generateError={generateError} />
            )}
            <Text>
              Füge Unterseiten hinzu, um mit einem Scanprofil mehrere Bereiche
              deiner Website im Blick zu behalten.
            </Text>
            <PathsList autoFocus={!!form.getValues("domain")} />
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
          <Button color="success" type="submit">
            Scan starten
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
