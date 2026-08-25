import {
  Action,
  ActionGroup,
  Alert,
  Button,
  Content,
  Header,
  Heading,
  InlineCode,
  Label,
  Modal,
  RadioButton,
  RadioGroup,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useForm, useWatch } from "react-hook-form";
import {
  Field,
  Form,
} from "@mittwald/flow-remote-react-components/react-hook-form";
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
} from "./components/generatePaths.tsx";

const defaultDomainInputTab = "mstudio";

export const CreateModal = () => {
  const goToProfile = useGoToProfile();
  const { contextId } = Route.useSearch();
  const [generateError, setGenerateError] = useState<GenerateError | null>(
    null,
  );

  const form = useForm<FormValues>({
    defaultValues: {
      domain: "",
      paths: new Set(["/"]),
      type: defaultDomainInputTab,
    },
  });

  const watchedTab = useWatch({ control: form.control, name: "type" });

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
      <Heading slot="title">Scanprofil anlegen</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Text>
              Wähle eine bestehende Domain aus dem mStudio oder gib eine
              individuelle Domain ein.
            </Text>
            <Field rules={{ required: true }} name="type">
              <RadioGroup>
                <Label>Domain-Art</Label>
                <RadioButton value="mstudio">mStudio Domain</RadioButton>
                <RadioButton value="custom">Individuelle Eingabe</RadioButton>
              </RadioGroup>
            </Field>
            {watchedTab === "mstudio" && <DomainSelect />}
            {watchedTab === "custom" && <Domain />}
            <Header>
              <Heading>Unterseiten hinzufügen</Heading>
              <GeneratePathsAction
                onError={setGenerateError}
                onSuccess={() => setGenerateError(null)}
              />
            </Header>
            {generateError && (
              <Alert status="danger">
                <Heading>Unterseiten nicht automatisch erkannt</Heading>
                <Content>
                  <Text>
                    Die Unterseiten für{" "}
                    <InlineCode>{generateError.domain}</InlineCode> konnten
                    nicht automatisch erkannt werden. Überprüfe die eingegebene
                    Domain und versuche es erneut.
                  </Text>
                </Content>
              </Alert>
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
          <Button color="accent" type="submit">
            Scan starten
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
