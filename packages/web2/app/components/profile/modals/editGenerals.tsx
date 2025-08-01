import { ScanProfile } from "../../../api/types.ts";
import {
  Action,
  ActionGroup,
  Button,
  Checkbox,
  ColumnLayout,
  Content,
  ContextualHelp,
  ContextualHelpTrigger,
  FieldDescription,
  Heading,
  Label,
  Modal,
  Section,
  Segment,
  SegmentedControl,
  Text,
  TextField,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import cronParser from "cron-parser";
import { useRouter } from "@tanstack/react-router";
import { updateProfileSettings } from "../../../actions/profile.ts";
import { WcagStandardContextualHelp } from "../wcagStandardContextualHelp.js";

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
      <Heading slot="title">Einstellungen bearbeiten</Heading>
      <Form form={form} onSubmit={onSubmit}>
        <Content>
          <Section>
            <Field
              name={"cronExpression"}
              rules={{
                validate: {
                  validCronExpression: (value) => {
                    try {
                      if (typeof value === "string") {
                        cronParser.parseExpression(value).hasNext();
                      }
                      return true;
                    } catch (e) {
                      if (!(e instanceof Error)) {
                        console.log(e);
                        return "Ungültiger Ausführungsintervall";
                      }
                      if (e.message === "Invalid cron expression") {
                        return "Ungültiger Cron-Ausdruck";
                      }
                      return (
                        "Ungültiger Ausführungsintervall: " +
                        (e as Error).message
                      );
                    }
                  },
                },
              }}
            >
              <TextField>
                <Label>
                  Ausführungsintervall
                  <ContextualHelpTrigger>
                    <Button />
                    <ContextualHelp>
                      <Heading>Ausführungsintervall</Heading>
                      <Text>
                        Lege nur dann einen automatischen Scan-Intervall fest,
                        wenn es wirklich nötig ist – so schonst du Ressourcen.
                        Lässt du das Feld leer, wird keine automatische
                        Ausführung eingerichtet. Ein manueller Scan ist
                        jederzeit möglich.
                      </Text>
                    </ContextualHelp>
                  </ContextualHelpTrigger>
                </Label>
                <FieldDescription>Verwende Cron-Syntax</FieldDescription>
              </TextField>
            </Field>
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
            <ColumnLayout>
              <Field name={"includeWarnings"}>
                <Checkbox>
                  <Label>Warnungen</Label>
                </Checkbox>
              </Field>
              <Field name={"includeNotices"}>
                <Checkbox>
                  <Label>Hinweise</Label>
                </Checkbox>
              </Field>
            </ColumnLayout>
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
