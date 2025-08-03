import { Label, TimeField } from "@mittwald/flow-remote-react-components";
import { Field } from "@mittwald/flow-remote-react-components/react-hook-form";
import type { FC } from "react";

export const CronTimeField: FC = () => {
  return (
    <Field
      name="cronTime"
      rules={{
        required: "Bitte gib eine Uhrzeit an",
      }}
    >
      <TimeField>
        <Label>Uhrzeit</Label>
      </TimeField>
    </Field>
  );
};
