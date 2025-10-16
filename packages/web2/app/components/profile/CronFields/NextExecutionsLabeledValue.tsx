import {
  Label,
  LabeledValue,
  Text,
} from "@mittwald/flow-remote-react-components";
import type { FC } from "react";
import React, { useMemo } from "react";
import { getExecutions, isValidCron } from "./lib";

interface Props {
  cron: string;
}

export const NextExecutionsLabeledValue: FC<Props> = (props) => {
  const { cron } = props;

  const executions = useMemo(() => getExecutions(cron), [cron]);

  if (cron === "" || !isValidCron(cron)) {
    return null;
  }

  const nextExecutions = executions.map((date) => {
    return (
      <React.Fragment key={date.toISOString()}>
        {date.toLocaleString("de-DE", {
          dateStyle: "short",
          timeStyle: "short",
        })}
        <br />
      </React.Fragment>
    );
  });

  return (
    <LabeledValue>
      <Label>Nächste Ausführungen</Label>
      <Text>{nextExecutions}</Text>
    </LabeledValue>
  );
};
