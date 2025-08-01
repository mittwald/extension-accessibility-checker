// app/ssr.tsx
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import React from "react";

import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
