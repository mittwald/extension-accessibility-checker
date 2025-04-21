import {
  ColumnLayout,
  Heading,
  LayoutCard,
} from "@mittwald/flow-react-components";
import { EducationCards } from "./list/educationCards.js";
import { ProfilesList } from "./list/profilesList.js";
import { NoProfiles } from "./list/noProfiles.js";
import { Route } from "../routes/index.js";
import { ScanProfile } from "../api/types.js";

export const ProfilesRoot = ({
  profiles,
}: {
  profiles: ScanProfile[] | null;
}) => {
  const hasProfiles = !!profiles && profiles.length > 0;

  return (
    <ColumnLayout s={[1]}>
      <Heading level={1} color="light">
        A11y Checker
      </Heading>
      <EducationCards />
      <LayoutCard>
        {hasProfiles ? <ProfilesList profiles={profiles} /> : <NoProfiles />}
      </LayoutCard>
    </ColumnLayout>
  );
};
