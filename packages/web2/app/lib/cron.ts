import cronParser from "cron-parser";
import cronstrue from "cronstrue";

export type CronValidationError = "not-parseable" | "too-frequent";

const hasValidSyntax = (cronExpression: string) => {
  try {
    cronstrue.toString(cronExpression);
    return true;
  } catch {
    return false;
  }
};

export const validateCron = (
  cronExpression: string | undefined,
): CronValidationError | undefined => {
  if (!cronExpression) {
    return;
  }

  if (!hasValidSyntax(cronExpression)) {
    return "not-parseable";
  }

  try {
    const interval = cronParser.parseExpression(cronExpression);
    const firstDate = interval.next();
    const secondDate = interval.next();
    const hoursDiff =
      (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 1) {
      return "too-frequent";
    }
  } catch {
    return "not-parseable";
  }
};
