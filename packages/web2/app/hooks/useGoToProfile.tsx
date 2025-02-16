import { useNavigate } from "@tanstack/react-router";
import { ScanProfile } from "../api/types.ts";

export const useGoToProfile = () => {
  const navigate = useNavigate();
  return (profile: ScanProfile) =>
    navigate({
      to: "/profiles/$profileId",
      params: { profileId: profile._id },
    });
};
