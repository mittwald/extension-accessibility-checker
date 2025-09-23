import { ScanProfile } from "../../../api/types.ts";
import {
  Action,
  ActionGroup,
  Button,
  CheckboxButton,
  CheckboxGroup,
  // Checkbox,
  Content,
  ContextualHelpTrigger,  
  Heading,
  Label,
  Modal,
  Section,
  Segment,
  SegmentedControl,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { useRouter } from "@tanstack/react-router";
import { updateProfileSettings } from "../../../actions/profile.ts";
import { WcagStandardContextualHelp } from "../wcagStandardContextualHelp.tsx";
import { CriteriaContextualHelp } from "../criteriaContextualHelp.tsx" 

interface FormValues {
  cronExpression?: string;
  standard: ScanProfile["standard"];
  includeWarnings: boolean;
  includeNotices: boolean;
}

export const EditGeneralsModal = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      cronExpression: profile.cronSchedule?.expression,
      standard: profile.standard,
      includeWarnings: profile.includeWarnings,
      includeNotices: profile.includeNotices,
    },
  });

  const Field = typedField(form);

  const controller = useOverlayController("Modal");

  const onSubmit = async (formValues: FormValues) => {
    await updateProfileSettings({
      data: {
        profileId: profile._id,
        ...formValues,
      },
    });
    await router.invalidate({ sync: true });
    controller.close();
  };

  return (
    <Modal>
      <Heading slot="title">Scan-Profil bearbeiten</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Field
              name={"standard"}
              rules={{
                required: "Bitte wähle eine Konformitätsstufe aus",
              }}
            >
              <SegmentedControl defaultValue={profile.standard}>
                <Label>
                  Konformitätsstufe
                  <ContextualHelpTrigger>
                    <Button />
                    <WcagStandardContextualHelp />
                  </ContextualHelpTrigger>
                </Label>
                <Segment value="WCAG2A">WCAG2 A</Segment>
                <Segment value="WCAG2AA">WCAG2 AA</Segment>
                <Segment value="WCAG2AAA">WCAG2 AAA</Segment>
              </SegmentedControl>
            </Field>

            <CheckboxGroup l={[1, 1]} m={[1]}>
              <Label>
                Kriterien
                <ContextualHelpTrigger>
                  <Button />
                  <CriteriaContextualHelp/>
                </ContextualHelpTrigger>
              </Label>
              
              <Field name={"includeWarnings"}>
                <CheckboxButton value="warnings">Warnungen</CheckboxButton>
              </Field>

              <Field name={"includeNotices"}>
                <CheckboxButton value="notices">Hinweise</CheckboxButton>
              </Field>
            </CheckboxGroup>
          </Section>
        </Content>
        <ActionGroup>
          <Button color="accent" type="submit">
            Speichern
          </Button>
          <Action closeOverlay="Modal">
            <Button
              color="secondary"
              variant="soft"
              onPress={() => form.reset()}
            >
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
