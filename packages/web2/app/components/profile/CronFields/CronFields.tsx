import { ColumnLayout } from "@mittwald/flow-remote-react-components";
import type { FC } from "react";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { getCronFromInterval, getCronFromTime, getTimeFromCron } from "./lib";
import { ClimateAccentBox } from "./ClimateAccentBox.js";
import { CronField } from "./CronField.js";
import { CronIntervalField } from "./CronIntervalField.js";
import { CronTimeField } from "./CronTimeField.js";
import { NextExecutionsLabeledValue } from "./NextExecutionsLabeledValue.js";

interface Props {
  form: UseFormReturn;
  name: string;
}

export const CronFields: FC<Props> = (props) => {
  const { form, name } = props;

  const watchedCron = useWatch({
    control: form.control,
    name: name,
  });

  const watchedCronInterval = useWatch({
    control: form.control,
    name: "cronInterval",
  });

  const watchedCronTime = useWatch({
    control: form.control,
    name: "cronTime",
  });

  const showTimeField =
    watchedCronInterval === "1d" ||
    watchedCronInterval === "7d" ||
    watchedCronInterval === "14d" ||
    watchedCronInterval === "30d";

  const showCronField = watchedCronInterval === "custom";

  useEffect(() => {
    const newValue = getCronFromTime(watchedCron, watchedCronTime);
    form.setValue(name, newValue);
  }, [watchedCronTime]);

  useEffect(() => {
    const newValue = getCronFromInterval(
      watchedCron,
      watchedCronInterval,
      showTimeField ? watchedCronTime : undefined,
    );
    form.setValue(name, newValue.cron);
    if (newValue.time) {
      form.setValue("cronTime", newValue.time);
    }
  }, [watchedCronInterval]);

  useEffect(() => {
    const newValue =
      watchedCronInterval === "custom"
        ? getTimeFromCron(watchedCron)
        : undefined;
    if (newValue) {
      form.setValue("cronTime", newValue);
    }
  }, [watchedCron]);

  return (
    <>
      <CronIntervalField />

      {showTimeField && (
        <ColumnLayout l={[1, 1]}>
          <CronTimeField />
        </ColumnLayout>
      )}

      {showCronField && (
        <ColumnLayout l={[1, 1]}>
          <CronField form={form as unknown as UseFormReturn} name={name} />
        </ColumnLayout>
      )}

      <NextExecutionsLabeledValue cron={watchedCron} />

      <ClimateAccentBox
        cronFieldName={name}
        form={form as unknown as UseFormReturn}
      />
    </>
  );
};
