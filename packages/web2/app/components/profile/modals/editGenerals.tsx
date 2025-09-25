import { ScanProfile } from "../../../api/types.ts";
import {
  Action,
  ActionGroup,
  Button,
  CheckboxButton,
  CheckboxGroup,
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
import { CriteriaContextualHelp } from "../criteriaContextualHelp.tsx";

interface FormValues {
  cronExpression?: string;
  standard: ScanProfile["standard"];
  includedCriteria: string[];
}

export const EditGeneralsModal = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();

  const criteria = [];
  if (profile.includeWarnings) {
    criteria.push("includeWarnings");
  }

  if (profile.includeNotices) {
    criteria.push("includeNotices");
  }

  const form = useForm<FormValues>({
    defaultValues: {
      cronExpression: profile.cronSchedule?.expression,
      standard: profile.standard,
      includedCriteria: criteria,
    },
  });

  const Field = typedField(form);

  const controller = useOverlayController("Modal");

  const onSubmit = async (formValues: FormValues) => {
    await updateProfileSettings({
      data: {
        profileId: profile._id,
        includeNotices: formValues.includedCriteria.includes("includeNotices"),
        includeWarnings:
          formValues.includedCriteria.includes("includeWarnings"),
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

            <Field name="includedCriteria">
              <CheckboxGroup>
                <Label>
                  Kriterien
                  <ContextualHelpTrigger>
                    <Button />
                    <CriteriaContextualHelp />
                  </ContextualHelpTrigger>
                </Label>
                <CheckboxButton value="includeWarnings">
                  Warnungen
                </CheckboxButton>
                <CheckboxButton value="includeNotices">Hinweise</CheckboxButton>
              </CheckboxGroup>
            </Field>
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
