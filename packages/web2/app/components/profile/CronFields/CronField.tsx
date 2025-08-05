import {
  FieldDescription,
  Label,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { Field } from "@mittwald/flow-remote-react-components/react-hook-form";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { getCronText, isValidCron } from "./lib";

interface Props {
  form: UseFormReturn;
  name: string;
}

export const CronField: FC<Props> = (props) => {
  const { form, name } = props;

  const watchedCron = useWatch({
    control: form.control,
    name: name,
  });

  const cronText = getCronText(watchedCron);

  return (
    <Field
      name={name}
      rules={{
        required: "Bitte gib ein Intervall ein",
        validate: {
          invalidCron: (v) =>
            isValidCron(v) ? undefined : "Ungültige Cron-Syntax",
        },
      }}
    >
      <TextField>
        <Label>Cron-Syntax</Label>
        {cronText && <FieldDescription>{cronText}</FieldDescription>}
      </TextField>
    </Field>
  );
};
