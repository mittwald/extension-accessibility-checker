import { json } from "@tanstack/react-start";

export const assertContextType = (context: { kind: string }) => {
  if (context.kind !== "project" && context.kind !== "customer") {
    throw json(
      { message: `Wrong context type '${context.kind}'` },
      { status: 400 },
    );
  }
};
