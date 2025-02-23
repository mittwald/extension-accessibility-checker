import { json } from "@tanstack/start";
import { SafeParseReturnType, SafeParseSuccess } from "zod";
import { logger } from "../../../logger.js";

export const handleAPIError = (e: unknown) => {
  if (e instanceof Response) {
    logger.debug(e.clone().text());
    return e;
  }
  logger.error(e);
  return json({ message: "Internal Server Error" }, { status: 500 });
};

export const assertValidationSuccess: <In, Out>(
  parseResult: SafeParseReturnType<In, Out>,
) => asserts parseResult is SafeParseSuccess<Out> = <In, Out>(
  parseResult: SafeParseReturnType<In, Out>,
): asserts parseResult is SafeParseSuccess<Out> => {
  if (!parseResult.success) {
    logger.debug(parseResult.error);
    throw json(
      { message: "Input validation failed", error: parseResult.error },
      { status: 400 },
    );
  }
};

export const assertContextType = (context: { kind: string }) => {
  if (context.kind !== "project") {
    throw json(
      { message: `Wrong context type '${context.kind}'` },
      { status: 400 },
    );
  }
};
