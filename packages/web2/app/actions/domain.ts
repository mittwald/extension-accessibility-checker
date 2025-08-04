import { createServerFn } from "@tanstack/react-start";
import { authenticateMiddleware } from "./middleware.js";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { z } from "zod";
import { extractPathFromUrl } from "../components/create/helpers.js";
import { XMLParser } from "fast-xml-parser";
import { log } from "vinxi/dist/types/lib/logger";

export const getDomains = createServerFn({
  method: "GET",
})
  .middleware([authenticateMiddleware])
  .handler(async ({ context }) => {
    const client = MittwaldAPIV2Client.newWithToken(context.apiToken);
    const domains = await client.domain.ingressListIngresses({});
    assertStatus(domains, 200);
    return domains.data;
  });

export const getPaths = createServerFn({
  method: "GET",
})
  .validator(z.string())
  .handler(async ({ data: domain }) => {
    if (!domain) return null;
    try {
      const response = await fetch(`https://${domain}/sitemap.xml`);
      if (!response.ok) return null;
      const text = await response.text();
      const parser = new XMLParser();
      const xml = parser.parse(text);

      console.log(xml.urlset.url);

      const countPathSegments = (url: string): number => {
        const path = extractPathFromUrl(url);
        return path.split("/").filter(Boolean).length;
      };

      const locations = xml.urlset.url
        .map(({ loc }: { loc: string }) => loc)
        .filter((url: string) => {
          const segmentCount = countPathSegments(url);
          return segmentCount <= 1;
        });

      console.log(locations);
      return locations;
    } catch (e) {
      console.error(e);
      return null;
    }
  });
