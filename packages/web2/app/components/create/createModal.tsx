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
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import { Form } from "@mittwald/flow-react-components/react-hook-form";
import { FormValues } from "./types.ts";
import { PathsList } from "./components/pathsList.tsx";
import { createProfile } from "../../actions.ts";
import { projectId } from "../../poc.ts";
import { useRouter } from "@tanstack/react-router";
import { Domain } from "./components/domain.tsx";

export const CreateModal = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      paths: new Set(["/"]),
    },
  });

  const onSubmit = (formValues: FormValues) => {
    createProfile({
      data: {
        ...formValues,
        name: formValues.domain,
        paths: Array.from(formValues.paths),
        projectId,
      },
    });
    router.invalidate();
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
                Füge Unterseiten hinzu. So kannst du mit einem Profil den
                Überblick über mehrere Seiten deiner Website bekommen.
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
            <Button color="accent" type="submit">
              Scan Starten
            </Button>
          </Action>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
