import { createMiddleware, createStart } from "@tanstack/react-start";
import { dbConnect } from "extension-a11y-checker-storage";

const dbRequestMiddleware = createMiddleware().server(async ({ next }) => {
  await dbConnect();
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [dbRequestMiddleware],
}));
