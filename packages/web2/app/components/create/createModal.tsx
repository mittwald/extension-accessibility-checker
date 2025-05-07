import {
  Action,
  ActionGroup,
  Button,
  Content,
  Header,
  Heading,
  Modal,
  Section,
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

export const CreateModal = () => {
  const goToProfile = useGoToProfile();
  const { contextId } = Route.useSearch();

  const form = useForm<FormValues>({
    defaultValues: {
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
          <Domain form={form} />
          <Section>
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
