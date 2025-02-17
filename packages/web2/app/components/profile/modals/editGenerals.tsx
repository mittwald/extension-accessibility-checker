import { ScanProfile } from "../../../api/types.ts";
import {
  Action,
  ActionGroup,
  Button,
  Checkbox,
  ColumnLayout,
  Content,
  Heading,
  Label,
  Modal,
  Section,
  TextField,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import cronParser from "cron-parser";
import { useRouter } from "@tanstack/react-router";
import { updateProfileSettings } from "../../../actions/profile.ts";

interface FormValues {
  cronExpression?: string;
  includeWarnings: boolean;
  includeNotices: boolean;
}

export const EditGeneralsModal = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      cronExpression: profile.cronSchedule?.expression,
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
                <Label>Ausführungsintervall</Label>
              </TextField>
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
            Änderungen speichern
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
