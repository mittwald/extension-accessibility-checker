/// <reference lib="dom" />
// The executor's tsconfig has no "dom" lib, but this file is browser code.

/**
 * Resolves the CSS path pa11y reports for an issue back into an element and
 * returns its position in the document.
 *
 * This function is serialized by `page.evaluate` (via toString) and executed in
 * the browser. It must therefore be self-contained: references to the module
 * scope - imports, constants, helpers from this file - are `undefined` at
 * runtime without TypeScript noticing. Types are fine, they are erased.
 */

export interface ResolvedElementRect {
  /** Position in the document, not in the viewport */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Start of the element's outerHTML, to cross-check against pa11y's context */
  htmlPrefix: string;
  documentWidth: number;
  documentHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  isVisuallyHidden: boolean;
}

export const resolveElementRect = (
  selector: string,
): ResolvedElementRect | null => {
  const resolveElement = (): Element | null => {
    try {
      const match = document.querySelector(selector);
      if (match) {
        return match;
      }
    } catch {
      // pa11y inserts ids unescaped ("#foo.bar"), which throws a SyntaxError
      // here. The path is walked segment by segment below instead.
    }

    let node: ParentNode | null = document;

    for (const segment of selector.split(" > ")) {
      if (!node) {
        return null;
      }

      // pa11y stops climbing at the first id, so "#id" can only ever be the
      // first segment. getElementById takes the raw string, which avoids the
      // escaping problem entirely.
      if (segment.startsWith("#")) {
        node = document.getElementById(segment.slice(1));
        continue;
      }

      const parsed = /^([a-z][a-z0-9-]*)(?::nth-child\((\d+)\))?$/i.exec(
        segment,
      );
      if (!parsed) {
        return null;
      }

      const [, tagName, nthChild] = parsed;
      const children = Array.from(node.children);

      // Without :nth-child the element is the only one of its tag among its
      // siblings - other elements may still sit next to it.
      const child = nthChild
        ? children[Number(nthChild) - 1]
        : children.find(
            (candidate) =>
              candidate.tagName.toLowerCase() === tagName.toLowerCase(),
          );

      if (!child || child.tagName.toLowerCase() !== tagName.toLowerCase()) {
        return null;
      }

      node = child;
    }

    return node instanceof Element ? node : null;
  };

  const element = resolveElement();
  if (!element) {
    return null;
  }

  element.scrollIntoView({ block: "center", inline: "center" });

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  const style = window.getComputedStyle(element);

  return {
    x: rect.x + window.scrollX,
    y: rect.y + window.scrollY,
    width: rect.width,
    height: rect.height,
    htmlPrefix: element.outerHTML.slice(0, 40),
    documentWidth: document.documentElement.scrollWidth,
    documentHeight: document.documentElement.scrollHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    isVisuallyHidden:
      style.clipPath === "inset(50%)" ||
      style.clip === "rect(0px, 0px, 0px, 0px)",
  };
};
