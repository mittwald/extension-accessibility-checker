import { getRouteApi } from "@tanstack/react-router";

const profileRoute = getRouteApi("/profiles/$profileId");

export const useProfileData = () => {
  const data = profileRoute.useLoaderData();

  if (!data) {
    throw new Error("no profile data");
  }

  return data;
};
