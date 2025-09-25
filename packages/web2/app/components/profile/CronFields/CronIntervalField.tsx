import { Label, Option, Select } from "@mittwald/flow-remote-react-components";
import { Field } from "@mittwald/flow-remote-react-components/react-hook-form";
import type { FC } from "react";
import type { CronInterval } from "./lib";

const intervals: { value: CronInterval; label: string }[] = [
  { value: "never", label: "Manuelle Ausführung" },
  { value: "1d", label: "Jeden Tag" },
  { value: "7d", label: "Alle 7 Tage" },
  { value: "14d", label: "Alle 14 Tage" },
  { value: "30d", label: "Alle 30 Tage" },
  { value: "custom", label: "Cron-Syntax" },
];

export const CronIntervalField: FC = () => {
  return (
    <Field
      name="cronInterval"
      rules={{
        required: "Bitte gib einen Intervall an",
      }}
    >
      <Select>
        <Label>Intervall</Label>
        {intervals.map((i) => (
          <Option key={i.value} value={i.value}>
            {i.label}
          </Option>
        ))}
      </Select>
    </Field>
  );
};
