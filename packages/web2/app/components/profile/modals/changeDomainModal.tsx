import { ScanProfile } from "../../../api/types.ts";
import { useForm } from "react-hook-form";
import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  OverlayController,
  Section,
} from "@mittwald/flow-remote-react-components";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { updateProfileDomain } from "../../../actions/profile.ts";
import { useRouter } from "@tanstack/react-router";
import { startScan } from "../../../actions/scan.js";
import { Domain } from "../../create/components/domain.js";

interface FormValues {
  domain: string;
}

interface ChangeDomainModalProps {
  controller: OverlayController;
  profile: ScanProfile;
}

export const ChangeDomainModal = ({
  controller,
  profile,
}: ChangeDomainModalProps) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      domain: profile.domain,
    },
  });

  const onSubmit = async (formValues: FormValues) => {
    await updateProfileDomain({
      data: {
        profileId: profile._id,
        domain: formValues.domain,
        updateName: profile.name === profile.domain,
      },
    });
    await startScan({ data: { profileId: profile._id } });
    await router.invalidate({ sync: true });
  };

  return (
    <Modal controller={controller}>
      <Form form={form} onSubmit={onSubmit}>
        <Heading slot="title">Domain bearbeiten</Heading>
        <Content>
          <Section>
            <Domain
              autoFocus
              form={form}
              helpText="Kontrolliere die Domain auf Richtigkeit und versuche es erneut."
            />
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
