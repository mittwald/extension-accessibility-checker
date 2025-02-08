import { ScanProfile } from "./types.ts";

export const getProfile = async (
  projectId: string,
  profileId: string,
): Promise<ScanProfile> => {
  const res = await fetch(
    `http://localhost:8080/api/projects/${projectId}/scan-profiles/${profileId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};
