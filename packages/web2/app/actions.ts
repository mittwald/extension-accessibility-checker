import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import {
  dbConnect,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { ScanProfile } from "./api/types.ts";
import { ObjectId } from "mongodb";
import { projectId } from "./poc.ts";

export const getProfiles = createServerFn().handler(async () => {
  await dbConnect();
  const data = await ScanProfileModel.findForProject(projectId);
  return data as unknown as ScanProfile[] | null;
});

export const startScan = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    const profile = await ScanProfileModel.findById(profileId);
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }
    await ScanModel.createForProfile(profile, new Date(), "user");
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
    // todo: startScan({ data: profile._id.toString() });
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

export const deleteProfile = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await ScanModel.deleteMany({ profile: profileId });
    await ScanProfileModel.findByIdAndDelete(profileId);
  });
