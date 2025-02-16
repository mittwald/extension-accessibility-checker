import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import {
  dbConnect,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { Scan, ScanProfile } from "../api/types.ts";
import { ObjectId } from "mongodb";
import { projectId } from "../poc.ts";
import { startScan } from "./scan.ts";

export const getProfiles = createServerFn().handler(async () => {
  await dbConnect();
  const data = await ScanProfileModel.findForProject(projectId);
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
    const profile = await ScanProfileModel.create({
      _id: new ObjectId(),
      project: projectId,
      ...data,
    });
    await startScan({ data: profile._id.toString() });
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
    }),
  )
  .handler(
    async ({
      data: { profileId, cronExpression, includeWarnings, includeNotices },
    }) => {
      const profile = await ScanProfileModel.findOneAndUpdate(
        { _id: profileId },
        {
          $set: {
            includeWarnings,
            includeNotices,
            cronSchedule: { expression: cronExpression },
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
    await ScanModel.deleteMany({ profile: profileId });
    await ScanProfileModel.findByIdAndDelete(profileId);
  });
