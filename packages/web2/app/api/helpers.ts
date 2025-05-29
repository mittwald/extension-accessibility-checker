import { logger } from "../logger.js";
import { isNotFound } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { SafeParseReturnType, SafeParseSuccess, ZodType } from "zod";

export const handleAPIError = (e: unknown, action?: string) => {
  if (e instanceof Response) {
    logger.debug(e.clone().text());
    return e;
  }
  if (isNotFound(e)) {
    return json({ message: "Not found", ...e.data }, { status: 404 });
  }
  logger.error(e);
  return json({ message: "Internal Server Error", action }, { status: 500 });
};

export const assertValidationSuccess: <In, Out>(
  parseResult: SafeParseReturnType<In, Out>,
) => asserts parseResult is SafeParseSuccess<Out> = <In, Out>(
  parseResult: SafeParseReturnType<In, Out>,
): asserts parseResult is SafeParseSuccess<Out> => {
  if (!parseResult.success) {
    logger.debug(parseResult.error);
    throw json(
      {
        message: "Input validation failed",
        error: { ...parseResult.error, name: "ValidationError" },
      },
      { status: 400 },
    );
  }
};

/*
 * Due to a missing typescript feature, the return type of this function can not be
 * `Promise<asserts value is SafeParseSuccess<Out>>` or something similar.
 * If you need the type information call the two functions on your own:
 * ```
 * const parsedInput = await schema.safeParseAsync(input);
 * assertValidationSuccess(parsedInput);
 * // ^ this will ensure `parsedInput` gets the type information
 * ```
 */
export const assertValidation = async <Out>(
  schema: ZodType<Out>,
  value: unknown,
) => {
  const validationResult = await schema.safeParseAsync(value);
  assertValidationSuccess(validationResult);
};
