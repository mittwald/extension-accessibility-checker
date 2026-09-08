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
import { ScanProfile } from "../../../api/types.ts";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { FormValues } from "../../create/types.ts";
import { useForm } from "react-hook-form";
import { PathsList } from "../../create/components/pathsList.tsx";
import { useRouter } from "@tanstack/react-router";

import { updateProfilePaths } from "../../../actions/profile.ts";
import {
  GenerateError,
  GeneratePathsAction,
} from "../../generatePaths/generatePaths.tsx";
import { useState } from "react";
import { GenerateErrorAlert } from "../../generatePaths/GenerateErrorAlert.tsx";

type PathFormValues = Pick<FormValues, "paths">;

export const EditPathsModal = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();

  const [generateError, setGenerateError] = useState<GenerateError>();

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
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Header>
              <Heading slot="title">Unterseiten bearbeiten</Heading>
              <GeneratePathsAction
                domain={profile.domain}
                onError={(error) => setGenerateError(error)}
                onSuccess={() => {
                  setGenerateError(undefined);
                }}
              />
            </Header>
            <Text>
              Füge Unterseiten hinzu. So kannst du mit einem Profil den
              Überblick über mehrere Seiten deiner Website bekommen.
            </Text>

            {generateError && (
              <GenerateErrorAlert generateError={generateError} />
            )}
            <PathsList autoFocus={true} />
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
            <Button color="success" type="submit">
              Speichern
            </Button>
          </Action>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
