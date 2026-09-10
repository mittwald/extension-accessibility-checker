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
import { FormProvider, useForm } from "react-hook-form";
import { PathsList } from "../../create/components/pathsList.tsx";
import { useRouter } from "@tanstack/react-router";

import { updateProfilePaths } from "../../../actions/profile.ts";
import {
  GenerateError,
  GeneratePathsAction,
} from "../../generatePaths/generatePaths.tsx";
import { useId, useState } from "react";
import { GenerateErrorAlert } from "../../generatePaths/GenerateErrorAlert.tsx";

type PathFormValues = Pick<FormValues, "paths">;

export const EditPathsModal = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();

  const [generateError, setGenerateError] = useState<GenerateError>();

  const defaultValues = { paths: profile.paths };

  const form = useForm<PathFormValues>({ defaultValues });
  const formId = useId();

  const onSubmit = async (formValues: PathFormValues) => {
    const { paths } = formValues;
    await updateProfilePaths({ data: { profileId: profile._id, paths } });
    await router.invalidate({ sync: true });
  };

  return (
    <Modal offCanvas>
      <FormProvider {...form}>
        <Content>
          <Section>
            <Form id={formId} form={form} onSubmit={onSubmit}>
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
            </Form>
            <PathsList autoFocus />
          </Section>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
            <Button color="success" type="submit" form={formId}>
              Speichern
            </Button>
          </Action>
        </ActionGroup>
      </FormProvider>
    </Modal>
  );
};
