import {
  ColumnLayout,
  LayoutCard,
} from "@mittwald/flow-remote-react-components";
import { EducationCards } from "./list/educationCards.js";
import { ProfilesList } from "./list/profilesList.js";
import { NoProfiles } from "./list/noProfiles.js";
import { ScanProfile } from "../api/types.js";

export const ProfilesRoot = ({
  profiles,
}: {
  profiles: ScanProfile[] | null;
}) => {
  const hasProfiles = !!profiles && profiles.length > 0;

  return (
    <ColumnLayout s={[1]}>
      <EducationCards />
      <LayoutCard>
        {hasProfiles ? <ProfilesList profiles={profiles} /> : <NoProfiles />}
      </LayoutCard>
    </ColumnLayout>
  );
};
