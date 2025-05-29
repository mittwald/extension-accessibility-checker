// app/api.ts
import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from "@tanstack/react-start/api";
import { dbConnect } from "extension-a11y-checker-storage";

await dbConnect();

export default createStartAPIHandler(defaultAPIFileRouteHandler);
