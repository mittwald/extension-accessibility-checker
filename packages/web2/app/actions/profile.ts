import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  dbConnect,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { Scan, ScanProfile } from "../api/types.ts";
import { ObjectId } from "mongodb";
import { startScan } from "./scan.ts";
import { notFound } from "@tanstack/react-router";

export const getProfiles = createServerFn()
  .validator(z.string())
  .handler(async ({ data: contextId }) => {
    await dbConnect();
    const data = await ScanProfileModel.findForProject(contextId);
    if (data === null) {
      throw notFound();
    }
    return data as unknown as ScanProfile[] | null;
  });

export const getProfile = createServerFn({
  method: "GET",
})
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await dbConnect();
    const profile = await ScanProfileModel.findById(profileId).exec();
    await profile?.populate("nextScan");
    const lastScan = await ScanModel.lastScanOfProfile(profileId);

    return {
      profile: {
        ...profile?.toObject(),
        issueSummary: lastScan?.getIssueSummary(),
      } as unknown as ScanProfile,
      lastScan: lastScan as unknown as Scan | undefined,
    };
  });

export const createProfile = createServerFn({ method: "POST" })
  .validator(
    z.object({
      projectId: z.string(),
      domain: z.string(),
      name: z.string(),
      paths: z.array(z.string()),
    }),
  )
  .handler(async ({ data: { projectId, ...data } }) => {
    const now = new Date();
    const profile = await ScanProfileModel.create({
      _id: new ObjectId(),
      project: projectId,
      cronSchedule: {
        expression: `${now.getMinutes()} ${now.getHours()} * * *`,
      },
      ...data,
    });
    await startScan({
      data: { profileId: profile._id.toString(), isSystemScan: true },
    });
    return profile.toJSON() as unknown as ScanProfile;
  });
export const updateProfilePaths = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string(),
      paths: z.array(z.string()),
    }),
  )
  .handler(async ({ data: { profileId, paths } }) => {
    const profile = await ScanProfileModel.findOneAndUpdate(
      { _id: profileId },
      { $set: { paths } },
      { new: true },
    );
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }
    return profile.toJSON() as unknown as ScanProfile;
  });

export const updateProfileName = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string(),
      name: z.string().optional(),
    }),
  )
  .handler(async ({ data: { profileId, name } }) => {
    const profile = await ScanProfileModel.findOneAndUpdate(
      { _id: profileId },
      { $set: { name } },
      { new: true },
    );
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }
    return profile.toJSON() as unknown as ScanProfile;
  });

export const updateProfileSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string(),
      cronExpression: z.string().optional(),
      includeWarnings: z.boolean(),
      includeNotices: z.boolean(),
      standard: z.enum(["WCAG2A", "WCAG2AA", "WCAG2AAA"]),
    }),
  )
  .handler(
    async ({
      data: {
        profileId,
        cronExpression,
        includeWarnings,
        includeNotices,
        standard,
      },
    }) => {
      if (cronExpression) {
        try {
          const interval = cronParser.parseExpression(cronExpression);
          const firstDate = interval.next();
          const secondDate = interval.next();
          const hoursDiff =
            (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60);

          if (hoursDiff < 1) {
            return new Response(
              "Cron expression must not run more than once per hour",
              { status: 400 },
            );
          }
        } catch (e) {
          return new Response("Invalid cron expression", { status: 400 });
        }
      }

      const cronUpdateSet = cronExpression
        ? { cronSchedule: { expression: cronExpression } }
        : undefined;

      const profile = await ScanProfileModel.findOneAndUpdate(
        { _id: profileId },
        {
          $set: {
            standard,
            includeWarnings,
            includeNotices,
            ...cronUpdateSet,
          },
          $unset: { cronSchedule: cronExpression ? undefined : 1 },
        },
        { new: true },
      );
      if (!profile) {
        return new Response("Profile not found", { status: 404 });
      }
      return profile.toJSON() as unknown as ScanProfile;
    },
  );

export const deleteProfile = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await ScanProfileModel.delete(profileId);
  });
