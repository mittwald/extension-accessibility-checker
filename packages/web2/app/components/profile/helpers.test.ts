import { describe, expect, test } from "vitest";
import { DateTime } from "luxon";
import { isScanResultExpired } from "./helpers.ts";
import { Scan, ScanProfile } from "../../api/types.ts";

const daysAgo = (days: number) => DateTime.now().minus({ days }).toJSDate();

const buildProfile = (createdAt: Date) =>
  ({ createdAt }) as unknown as ScanProfile;

const successfulScan = { completedAt: daysAgo(1) } as unknown as Scan;

describe("isScanResultExpired", () => {
  test("is false for a profile with a successful scan", () => {
    expect(
      isScanResultExpired(buildProfile(daysAgo(120)), successfulScan),
    ).toBe(false);
  });

  test("is false for a profile younger than the deletion period", () => {
    expect(isScanResultExpired(buildProfile(daysAgo(89)))).toBe(false);
  });

  test("is true for a profile older than the deletion period without a successful scan", () => {
    expect(isScanResultExpired(buildProfile(daysAgo(91)))).toBe(true);
  });
});
