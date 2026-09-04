import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profiles/$profileId/")({
  ssr: false,
  beforeLoad: ({ params, search }) => {
    throw redirect({
      to: "/profiles/$profileId/overview",
      params,
      search,
      replace: true,
    });
  },
});
