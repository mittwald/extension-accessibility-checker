// app/api.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { dbConnect } from "extension-a11y-checker-storage";

await dbConnect();

const fetch = createStartHandler(defaultStreamHandler);

export default {
  fetch,
};
