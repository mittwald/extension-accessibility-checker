import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { dbConnect } from "extension-a11y-checker-storage";

const dbRequestMiddleware = createMiddleware().server(async ({ next }) => {
  await dbConnect();
  return next();
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, dbRequestMiddleware],
}));
