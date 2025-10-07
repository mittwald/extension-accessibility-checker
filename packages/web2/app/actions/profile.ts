import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ScanModel, ScanProfileModel } from "extension-a11y-checker-storage";
import { Scan, ScanProfile } from "../api/types.ts";
import { ObjectId } from "mongodb";
import { notFound } from "@tanstack/react-router";
import {
  authenticateMiddleware,
  contextMatchingMiddleware,
  dbMiddleware,
  profileAuthorizeMiddleware,
  profileIdAuthorizeMiddleware,
} from "./middleware.js";
import { scheduleScan, validateCron } from "./commons.js";

export const getProfiles = createServerFn()
  .middleware([dbMiddleware, authenticateMiddleware])
  .validator(z.string())
  .handler(async ({ data: contextId }) => {
    const data = await ScanProfileModel.findForContext(contextId);
    if (data === null) {
      throw notFound();
    }
    const profiles = data.map((profileDoc) => {
      const profileObject = profileDoc.toObject();
      return {
        ...profileObject,
        issueSummary: profileDoc.lastScan?.getIssueSummary(),
      } as unknown as ScanProfile;
    });
    return profiles;
  });

export const getProfile = createServerFn({
  method: "GET",
})
  .middleware([dbMiddleware, profileIdAuthorizeMiddleware])
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    const profile = await ScanProfileModel.findById(profileId).exec();
    await profile?.populate("nextScan");
    const lastScan = await ScanModel.lastScanOfProfile(profileId);
    const lastSuccessfulScan =
      await ScanModel.lastSuccessfulScanOfProfile(profileId);

    return {
      profile: {
        ...profile?.toObject(),
        issueSummary: lastScan?.getIssueSummary(),
      } as unknown as ScanProfile,
      lastScan: lastScan as unknown as Scan | undefined,
      lastSuccessfulScan: lastSuccessfulScan as unknown as Scan | undefined,
    };
  });

export const createProfile = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, contextMatchingMiddleware])
  .validator(
    z.object({
      contextId: z.string(),
      domain: z.string(),
      name: z.string(),
      paths: z.array(z.string()),
    }),
  )
  .handler(async ({ data: { contextId, ...data } }) => {
    const profile = await ScanProfileModel.create({
      _id: new ObjectId(),
      context: contextId,
      ...data,
    });
    await scheduleScan(profile._id.toString(), true);
    return profile.toJSON() as unknown as ScanProfile;
  });

export const updateProfilePaths = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, profileAuthorizeMiddleware])
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
  .middleware([dbMiddleware, profileAuthorizeMiddleware])
  .validator(
    z.object({
      profileId: z.string(),
      name: z.string(),
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

export const updateProfileDomain = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, profileAuthorizeMiddleware])
  .validator(
    z.object({
      profileId: z.string(),
      updateName: z.boolean().optional(),
      domain: z
        .string()
        .regex(
          /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
          "Not a valid domain name.",
        ),
    }),
  )
  .handler(async ({ data: { profileId, domain, updateName } }) => {
    const additionalUpdates = updateName ? { name: domain } : {};
    const profile = await ScanProfileModel.findOneAndUpdate(
      { _id: profileId },
      { $set: { domain, ...additionalUpdates } },
      { new: true },
    );
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }

    const nextScan = await ScanModel.nextScanOfProfile(profileId);
    if (nextScan) {
      await nextScan.regeneratePageUrls();
    }

    return profile.toJSON() as unknown as ScanProfile;
  });

export const updateProfileCron = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, profileAuthorizeMiddleware])
  .validator(
    z.object({
      profileId: z.string(),
      cronExpression: z.string(),
    }),
  )
  .handler(async ({ data: { profileId, cronExpression } }) => {
    const validationResult = validateCron(cronExpression);
    if (validationResult !== true) {
      return validationResult;
    }

    const cronUpdateSet = cronExpression
      ? { cronSchedule: { expression: cronExpression } }
      : undefined;
    const cronDeleteSet = cronExpression ? undefined : { cronSchedule: 1 };

    const profile = await ScanProfileModel.findOneAndUpdate(
      { _id: profileId },
      {
        $set: cronUpdateSet ?? {},
        $unset: cronDeleteSet ?? {},
      },
      { new: true },
    );
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }

    await ScanModel.deleteScheduledForProfile(profile);
    await ScanModel.scheduleNextForProfile(profile);

    return profile.toJSON() as unknown as ScanProfile;
  });

export const updateProfileSettings = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, profileAuthorizeMiddleware])
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
      const validationResult = validateCron(cronExpression);
      if (validationResult !== true) {
        return validationResult;
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
  .middleware([profileIdAuthorizeMiddleware])
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await ScanProfileModel.delete(profileId);
  });
