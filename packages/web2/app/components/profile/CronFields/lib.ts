import { Time } from "@internationalized/date";
import cronstrue from "cronstrue";
import "cronstrue/locales/de";
import { CronExpressionParser } from "cron-parser";

// todo: get actual language
export const getCronText = (cronSyntax: string) => {
  try {
    return `${cronstrue.toString(cronSyntax, {
      locale: "de",
      verbose: true,
    })}`;
  } catch {
    return undefined;
  }
};

export const isValidCron = (cronSyntax: string) => {
  return !!getCronText(cronSyntax);
};

export type CronInterval =
  | "never"
  | "1h"
  | "1d"
  | "7d"
  | "14d"
  | "30d"
  | "custom";

export const getIntervalValueFromCronSyntax = (
  cronSyntax: string,
): CronInterval => {
  switch (true) {
    case cronSyntax === "":
      return "never";
    case /^\d+ \d+ \* \* \*$/.test(cronSyntax):
      return "1d";
    case /^\d+ \d+ \* \* \d+$/.test(cronSyntax):
      return "7d";
    case /^\d+ \d+ \d+,\d+ \* \*$/.test(cronSyntax):
      return "14d";
    case /^\d+ \d+ \d+ \* \*$/.test(cronSyntax):
      return "30d";
    default:
      return "custom";
  }
};

export const randomNumberFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isDigitString = (value?: string): boolean => {
  if (!value) {
    return false;
  }
  return /^\d+$/.test(value);
};

export const getCronFromInterval = (
  cron: string,
  interval: CronInterval,
  time?: Time,
) => {
  const minuteOfTime =
    time?.minute && !isNaN(time.minute) ? time.minute : undefined;
  const hourOfTime = time?.hour && !isNaN(time.hour) ? time.hour : undefined;

  const cronParts = cron.split(" ");
  const minute =
    minuteOfTime ??
    (cronParts[0] && isDigitString(cronParts[0])
      ? cronParts[0]
      : randomNumberFromRange(0, 59));
  const hour =
    hourOfTime ??
    (cronParts[1] && isDigitString(cronParts[1])
      ? cronParts[1]
      : randomNumberFromRange(0, 23));
  const day =
    cronParts[2] && isDigitString(cronParts[2])
      ? cronParts[2]
      : randomNumberFromRange(1, 31);
  const weekday =
    cronParts[4] && isDigitString(cronParts[4])
      ? cronParts[4]
      : randomNumberFromRange(0, 6);

  const newTime = new Time(
    typeof hour === "number" ? hour : parseInt(hour),
    typeof minute === "number" ? minute : parseInt(minute),
  );

  const randomDay = randomNumberFromRange(1, 14);

  switch (interval) {
    case "never":
      return { cron: "" };
    case "1h":
      return {
        cron: `${minute} * * * *`,
      };
    case "1d":
      return {
        cron: `${minute} ${hour} * * *`,
        time: newTime,
      };
    case "7d":
      return {
        cron: `${minute} ${hour} * * ${weekday}`,
        time: newTime,
      };
    case "14d":
      return {
        cron: `${minute} ${hour} ${randomDay},${randomDay + 14} * *`,
        time: newTime,
      };
    case "30d":
      return {
        cron: `${minute} ${hour} ${day} * *`,
        time: newTime,
      };

    default:
      return { cron };
  }
};

export const getTimeFromCron = (cron: string) => {
  const cronParts = cron.split(" ");
  const minute =
    cronParts[0] && isDigitString(cronParts[0]) ? cronParts[0] : undefined;
  const hour =
    cronParts[1] && isDigitString(cronParts[1]) ? cronParts[1] : undefined;

  if (hour && minute) {
    return new Time(parseInt(hour), parseInt(minute));
  }
};

export const getCronFromTime = (cron: string, time?: Time) => {
  if (!time) {
    return cron;
  }
  const cronParts = cron.split(" ");
  cronParts[1] = time.hour.toString();
  cronParts[0] = time.minute.toString();
  return cronParts.join(" ");
};

export const isSmallIntervall = (schedule: string) => {
  if (!schedule) {
    return false;
  }
  try {
    const interval = CronExpressionParser.parse(schedule);
    const firstDate = interval.next();
    const secondDate = interval.next();
    const hoursDiff =
      (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60);

    const dayInHours = 24;

    return hoursDiff < dayInHours * 5;
  } catch {
    return false;
  }
};

export const getExecutions = (cron: string) => {
  try {
    const interval = CronExpressionParser.parse(cron);

    const executions: Date[] = [];

    while (executions.length < 3) {
      executions.push(interval.next().toDate());
    }

    return executions;
  } catch {
    return [];
  }
};
