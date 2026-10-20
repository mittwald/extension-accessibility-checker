import { afterAll, beforeAll, describe, expect, test } from "vitest";
import puppeteer, { Browser, Page } from "puppeteer";
import {
  ResolvedElementRect,
  resolveElementRect,
} from "./resolveElementRect.js";

/**
 * These tests run the function the way production does: serialized into a real
 * Chrome via `page.evaluate`. A jsdom test could not do that - it has no layout
 * engine (every `getBoundingClientRect` is 0x0), and module-scope references
 * would resolve there instead of failing, hiding exactly the bug the function's
 * doc comment warns about.
 */

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
});

afterAll(async () => {
  await browser?.close();
});

const resolve = async (
  html: string,
  selector: string,
): Promise<ResolvedElementRect | null> => {
  await page.setContent(html);
  return page.evaluate(resolveElementRect, selector);
};

/** Keeps the fixtures readable: a block of a known size at a known place. */
const box = (attrs = "") =>
  `<div ${attrs} style="width:200px;height:50px;background:#ccc">x</div>`;

describe("resolveElementRect", () => {
  test("resolves a plain path and reports the element's size", async () => {
    const rect = await resolve(
      `<main>${box('id="target"')}</main>`,
      "html > body > main > div",
    );

    expect(rect).not.toBeNull();
    expect(rect!.width).toBe(200);
    expect(rect!.height).toBe(50);
  });

  test("counts :nth-child across all siblings, not just matching tags", async () => {
    const rect = await resolve(
      `<main><span>a</span>${box()}${box('data-testid="second"')}</main>`,
      // The 3rd child overall, which is the 2nd div.
      "html > body > main > div:nth-child(3)",
    );

    expect(rect!.htmlPrefix).toContain('data-testid="second"');
  });

  test("finds the only element of its tag when pa11y omits :nth-child", async () => {
    // pa11y leaves out the index here because there is just one <main>, even
    // though it is the second element child of <body>.
    const rect = await resolve(
      `<script>void 0;</script><main>${box()}</main>`,
      "html > body > main > div",
    );

    expect(rect).not.toBeNull();
    expect(rect!.width).toBe(200);
  });

  test("walks the tbody the HTML parser inserts", async () => {
    // No <tbody> in the source - Chrome adds it, and pa11y reports it.
    const rect = await resolve(
      `<table><tr><td>a</td><td>${box()}</td></tr></table>`,
      "html > body > table > tbody > tr > td:nth-child(2)",
    );

    expect(rect).not.toBeNull();
    expect(rect!.htmlPrefix.startsWith("<td>")).toBe(true);
  });

  describe("ids pa11y inserts unescaped", () => {
    test("an id containing a dot, which querySelector reads as a class", async () => {
      const rect = await resolve(
        `<main>${box('id="foo.bar"')}</main>`,
        "#foo.bar",
      );

      expect(rect).not.toBeNull();
      expect(rect!.htmlPrefix).toContain("foo.bar");
    });

    test("an id starting with a digit, which throws a SyntaxError", async () => {
      const rect = await resolve(
        `<main id="2col"><span>a</span>${box()}</main>`,
        "#2col > div",
      );

      expect(rect).not.toBeNull();
      expect(rect!.width).toBe(200);
    });
  });

  describe("returns null", () => {
    test("when the element at the :nth-child index has another tag", async () => {
      const rect = await resolve(
        `<main><span>a</span><span>b</span></main>`,
        "html > body > main > div:nth-child(2)",
      );

      expect(rect).toBeNull();
    });

    test("when the fallback meets a segment it cannot parse", async () => {
      // The "#2col" makes querySelector throw, so the path is walked by hand -
      // and the walk only understands tag names and :nth-child. A class
      // selector alone would never get here: querySelector handles it fine.
      const rect = await resolve(
        `<main id="2col">${box('class="x"')}</main>`,
        "#2col > div.x",
      );

      expect(rect).toBeNull();
    });

    test("when a segment of the path does not exist", async () => {
      const rect = await resolve(
        `<main>${box()}</main>`,
        "html > body > aside > div",
      );

      expect(rect).toBeNull();
    });

    test("for an element without any extent", async () => {
      const rect = await resolve(
        `<main><div style="width:0;height:0"></div></main>`,
        "html > body > main > div",
      );

      expect(rect).toBeNull();
    });
  });

  describe("visually hidden elements", () => {
    test("are flagged for the clip-path technique", async () => {
      const rect = await resolve(
        `<main><span style="position:absolute;clip-path:inset(50%);width:1px;height:1px">skip link</span></main>`,
        "html > body > main > span",
      );

      expect(rect!.isVisuallyHidden).toBe(true);
    });

    test("are flagged for the legacy clip technique", async () => {
      const rect = await resolve(
        `<main><span style="position:absolute;clip:rect(0,0,0,0);width:1px;height:1px">skip link</span></main>`,
        "html > body > main > span",
      );

      expect(rect!.isVisuallyHidden).toBe(true);
    });

    test("are not flagged for an ordinary element", async () => {
      const rect = await resolve(
        `<main>${box()}</main>`,
        "html > body > main > div",
      );

      expect(rect!.isVisuallyHidden).toBe(false);
    });
  });

  test("reports document coordinates, not viewport ones", async () => {
    const rect = await resolve(
      `<main><div style="height:5000px"></div>${box()}</main>`,
      "html > body > main > div:nth-child(2)",
    );

    // The element sits below the fold, so scrollIntoView moved the viewport.
    // The y it reports must still be the offset within the document.
    expect(rect!.y).toBeGreaterThan(rect!.viewportHeight);
    expect(rect!.y).toBeCloseTo(5000 + 8, 0); // 8px default body margin
    expect(rect!.documentHeight).toBeGreaterThan(5000);
  });

  test("shortens htmlPrefix to 40 characters", async () => {
    const rect = await resolve(
      `<main><div id="a-fairly-long-id-value-for-this-test" style="width:200px;height:50px">content</div></main>`,
      "html > body > main > div",
    );

    expect(rect!.htmlPrefix).toHaveLength(40);
  });
});
