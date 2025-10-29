import { useRouter } from "@tanstack/react-router";
import { ScanProfile } from "~/api/types";
import { Route } from "~/routes";
import { useConfig } from "@mittwald/ext-bridge/react";

export const useGoToProfile = () => {
  const router = useRouter();
  const search = Route.useSearch();

  return async (profile: ScanProfile) => {
    router.navigate({
      to: "/profiles/$profileId",
      params: { profileId: profile._id },
      search: {
        ...search,
      },
    });

    // await router.invalidate({ sync: true });
  };
};

export const useGoToRoot = () => {
  const router = useRouter();
  // const search = Route.useSearch();

  const { customerId } = useConfig();

  return () => {
    router.navigate({
      to: "/",
      search: {
        contextId: customerId,
      },
    });

    router.invalidate({ sync: true });
  };
};
