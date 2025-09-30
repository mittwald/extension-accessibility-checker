import { ScanProfile } from "~/api/types";
import { useForm } from "react-hook-form";
import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  OverlayController,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";
import {
  Field,
  Form,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { updateProfileName } from "~/actions/profile";
import { useRouter } from "@tanstack/react-router";

interface FormValues {
  name: string;
}

export const RenameProfileModal = ({
  controller,
  profile,
}: {
  controller: OverlayController;
  profile: ScanProfile;
}) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      name: profile.name,
    },
  });

  const onSubmit = async (formValues: FormValues) => {
    await updateProfileName({
      data: { profileId: profile._id, name: formValues.name },
    });
    await router.invalidate({ sync: true });
  };

  return (
    <Modal controller={controller}>
      <Form form={form} onSubmit={onSubmit}>
        <Heading slot="title">Profil umbenennen</Heading>
        <Content>
          <Section>
            <Text>
              Gib deinem Profil einen aussagekräftigen Namen, sodass du es
              schnell identifizieren kannst.
            </Text>
            <Field name="name" rules={{ required: true }}>
              <TextField autoFocus>
                <Label>Profilname</Label>
              </TextField>
            </Field>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Button color="accent" type="submit">
              Speichern
            </Button>
            <Button slot="abort" color="secondary" variant="soft">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
