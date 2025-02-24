import { json } from "@tanstack/start";

export const assertContextType = (context: { kind: string }) => {
  if (context.kind !== "project") {
    throw json(
      { message: `Wrong context type '${context.kind}'` },
      { status: 400 },
    );
  }
};
