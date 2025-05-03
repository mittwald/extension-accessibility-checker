import { useRouter } from "@tanstack/react-router";
import { ScanProfile } from "../api/types.ts";
import { Route } from "../routes/index.js";

export const useGoToProfile = () => {
  const router = useRouter();
  const search = Route.useSearch();

  return async (profile: ScanProfile) => {
    router.navigate({
      search: {
        ...search,
        profileId: profile._id,
      },
      replace: true,
    });

    await router.invalidate({ sync: true });
  };
};

export const useGoToRoot = () => {
  const router = useRouter();
  const search = Route.useSearch();

  return () => {
    router.navigate({
      search: {
        contextId: search.contextId,
      },
      replace: true,
    });

    router.invalidate({ sync: true });
  };
};
