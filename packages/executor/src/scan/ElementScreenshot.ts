/// <reference lib="dom" />
// The evaluate callbacks below run in the browser, so this file needs the DOM
// types although the executor's tsconfig has no "dom" lib.

import { Page as PuppeteerPage, ScreenshotClip } from "puppeteer";
import { Pa11yIssue } from "pa11y";
import { logger } from "../logger.js";
import {
  ResolvedElementRect,
  resolveElementRect,
} from "./resolveElementRect.js";

const log = logger.child({ module: "ElementScreenshot" });

/**
 * Selectors pointing at the whole page: a screenshot of those shows no
 * concrete location (e.g. a missing lang attribute on the html element).
 */
const ignoredSelectors = ["", "html", "head", "body"];

/** Margin around the element so the issue is visible in its context. */
const paddingPx = 24;

/** Caps how much time screenshots may add to a page scan. */
const maxScreenshotsPerPage = 50;

/** Tall elements (lists, containers) would produce unusably large images. */
const maxClipHeightPx = 1024;

const highlightOverlayId = "a11y-checker-screenshot-highlight";
const highlightColor = "#e5484d";

export interface CapturedScreenshot {
  selector: string;
  image: Buffer;
  mimeType: string;
  width: number;
  height: number;
}

export class ElementScreenshot {
  /**
   * Captures one screenshot per selector. Several issues often point at the
   * same element, so selectors are deduplicated.
   */
  public static async captureForIssues(
    page: PuppeteerPage,
    issues: Pa11yIssue[],
  ): Promise<Map<string, CapturedScreenshot>> {
    const captured = new Map<string, CapturedScreenshot>();
    const skipped = new Set<string>();

    for (const issue of issues) {
      const selector = issue.selector;

      if (
        ignoredSelectors.includes(selector) ||
        captured.has(selector) ||
        skipped.has(selector)
      ) {
        continue;
      }

      if (captured.size >= maxScreenshotsPerPage) {
        log.debug("📸 screenshot limit of %d reached", maxScreenshotsPerPage);
        break;
      }

      const screenshot = await this.capture(page, selector);
      if (screenshot) {
        captured.set(selector, screenshot);
      } else {
        skipped.add(selector);
      }
    }

    return captured;
  }

  private static async capture(
    page: PuppeteerPage,
    selector: string,
  ): Promise<CapturedScreenshot | null> {
    try {
      const rect = await page.evaluate(resolveElementRect, selector);
      if (!rect) {
        log.trace("no visible element for selector %s", selector);
        return null;
      }

      const clip = this.buildClip(rect);

      await this.showHighlight(page, rect);
      let image;
      try {
        image = await page.screenshot({ type: "webp", quality: 80, clip });
      } finally {
        await this.hideHighlight(page);
      }

      return {
        selector,
        image: Buffer.from(image),
        mimeType: "image/webp",
        width: Math.round(clip.width),
        height: Math.round(clip.height),
      };
    } catch (e) {
      // A single unreachable element must never fail the whole scan
      log.debug(e, "could not capture screenshot for selector %s", selector);
      return null;
    }
  }

  private static buildClip(rect: ResolvedElementRect): ScreenshotClip {
    const x = Math.max(0, rect.x - paddingPx);
    const y = Math.max(0, rect.y - paddingPx);

    return {
      x,
      y,
      width: Math.min(rect.width + 2 * paddingPx, rect.documentWidth - x),
      height: Math.min(
        rect.height + 2 * paddingPx,
        maxClipHeightPx,
        rect.documentHeight - y,
      ),
    };
  }

  /**
   * Marks the issue location with an absolutely positioned overlay instead of
   * styling the element itself, which leaves the page's own layout untouched.
   * The callback runs in the browser, so everything it needs is passed in.
   */
  private static async showHighlight(
    page: PuppeteerPage,
    rect: ResolvedElementRect,
  ) {
    await page.evaluate(
      (box, id, color) => {
        const overlay = document.createElement("div");
        overlay.id = id;
        overlay.style.cssText = [
          "position:absolute",
          `left:${box.x}px`,
          `top:${box.y}px`,
          `width:${box.width}px`,
          `height:${box.height}px`,
          `outline:3px solid ${color}`,
          "outline-offset:2px",
          "pointer-events:none",
          "z-index:2147483647",
        ].join(";");
        document.body?.appendChild(overlay);
      },
      { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      highlightOverlayId,
      highlightColor,
    );
  }

  private static async hideHighlight(page: PuppeteerPage) {
    await page.evaluate(
      (id) => document.getElementById(id)?.remove(),
      highlightOverlayId,
    );
  }
}
