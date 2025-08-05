import { createServerFn } from "@tanstack/react-start";
import { authenticateMiddleware } from "./middleware.js";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import { z } from "zod";
import { extractPathFromUrl } from "../components/create/helpers.js";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import { CheerioAPI, AcceptedElems } from "cheerio";

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

      const locations: string[] = xml.urlset.url
        .map(({ loc }: { loc: string }) => loc)
        .filter((url: string) => {
          const segmentCount = countPathSegments(url);
          return segmentCount <= 1;
        });

      return locations;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

function extractLinks($: CheerioAPI, el: AcceptedElems<any>) {
  return $(el)
    .find("a")
    .map((_, a) => {
      const href = $(a).attr("href");
      return href ? resolveUrl(href) : null;
    })
    .get()
    .filter(Boolean);
}

function resolveUrl(relative: string) {
  if (relative.startsWith("/") && !relative.startsWith("/#")) {
    return relative;
  }
  return null;
}

export const getPathsFromMenu = createServerFn({
  method: "GET",
})
  .validator(z.string())
  .handler(async ({ data: domain }) => {
    if (!domain) return null;
    try {
      const response = await axios.get("https://" + domain);
      const $ = cheerio.load(response.data);

      let navLinks: string[] = [];

      // === STRATEGY 1: <nav> elements ===
      $("nav").each((_, nav) => {
        const links = extractLinks($, nav);
        navLinks.push(...links);
      });

      // === STRATEGY 2: [role="navigation"] ===
      if (navLinks.length === 0) {
        $('[role="navigation"]').each((_, nav) => {
          const links = extractLinks($, nav);
          navLinks.push(...links);
        });
      }

      // === STRATEGY 3: <ul> or <div> with at least 3 <a> ===
      if (navLinks.length === 0) {
        $("ul, div").each((_, el) => {
          const links = extractLinks($, el);
          navLinks.push(...links);
        });
      }

      return navLinks;
    } catch (error) {
      return null;
    }
  });
