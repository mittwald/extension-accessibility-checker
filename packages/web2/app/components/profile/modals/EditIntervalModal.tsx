import type { FC } from "react";
import {
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  Section,
  Text,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { Form } from "@mittwald/flow-remote-react-components/react-hook-form";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Time } from "@internationalized/date";
import { Action } from "@mittwald/flow-remote-react-components";
import {
  CronInterval,
  getIntervalValueFromCronSyntax,
} from "../CronFields/lib.js";
import { ScanProfile } from "../../../api/types.js";
import { CronFields } from "../CronFields/CronFields.js";
import { updateProfileCron } from "../../../actions/profile.js";
import { useRouter } from "@tanstack/react-router";

interface Props {
  profile: ScanProfile;
}

interface Values {
  interval: string;
  cronTime: Time;
  cronInterval: CronInterval;
}

export const EditIntervalModal: FC<Props> = (props) => {
  const { profile } = props;
  const router = useRouter();

  const currentInterval = profile.cronSchedule?.expression ?? "";

  const defaultValues: Values = {
    interval: currentInterval,
    cronTime: new Time(
      parseInt(currentInterval?.split(" ")[1] ?? "0"),
      parseInt(currentInterval?.split(" ")[0] ?? "0"),
    ),
    cronInterval: getIntervalValueFromCronSyntax(currentInterval),
  };

  const form = useForm<Values>({ defaultValues });

  const controller = useOverlayController("Modal", {
    onOpen: () => form.reset(defaultValues),
  });

  const handleOnSubmit = async (values: Values) => {
    const { interval } = values;

    await updateProfileCron({
      data: {
        profileId: profile._id,
        cronExpression: interval === "never" ? "" : interval,
      },
    });
    await router.invalidate({ sync: true });

    controller.close();
  };

  return (
    <Modal controller={controller}>
      <Form form={form} onSubmit={handleOnSubmit}>
        <Heading>Ausführungsintervall bearbeiten</Heading>
        <Content>
          <Section>
            <Text>
              Das Intervall legt fest, ob und wann dein Scan automatisch
              ausgeführt werden soll. Lege nur dann einen automatischen
              Scan-Intervall fest, wenn es wirklich nötig ist – so schonst du
              Ressourcen. Wählst du »Nur manuell«, wird keine automatische
              Ausführung eingerichtet. Ein manueller Scan ist jederzeit möglich.
            </Text>
            <CronFields
              form={form as unknown as UseFormReturn}
              name="interval"
            />
          </Section>
        </Content>

        <ActionGroup>
          <Button color="accent" type="submit">
            Speichern
          </Button>
          <Action closeOverlay="Modal">
            <Button color="secondary" slot="abort" variant="soft">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
