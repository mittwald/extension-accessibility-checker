import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { ScanProfile } from "../../../api/types.ts";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { FormValues } from "../../create/types.ts";
import { useForm } from "react-hook-form";
import { PathsList } from "../../create/components/pathsList.tsx";
import { useRouter } from "@tanstack/react-router";

import { updateProfilePaths } from "../../../actions/profile.ts";

type PathFormValues = Pick<FormValues, "paths">;

export const EditPathsModal = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();

  const form = useForm<PathFormValues>({
    values: {
      paths: new Set(profile.paths),
    },
  });

  const onSubmit = async (formValues: PathFormValues) => {
    await updateProfilePaths({
      data: { profileId: profile._id, paths: Array.from(formValues.paths) },
    });
    await router.invalidate({ sync: true });
  };

  return (
    <Modal offCanvas>
      <Heading slot="title">Unterseiten bearbeiten</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Text>
              Füge Unterseiten hinzu. So kannst du mit einem Profil den
              Überblick über mehrere Seiten deiner Website bekommen.
            </Text>
            <PathsList form={form} autoFocus={true} />
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
              Speichern
            </Button>
          </Action>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
