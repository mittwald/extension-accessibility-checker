import { ScanProfile } from "../../api/types.ts";
import { isPending, isRunning } from "../profile/helpers.ts";
import {
  AlertBadge,
  Avatar,
  Heading,
  IconSubdomain,
  ListItemView,
  Text,
} from "@mittwald/flow-react-components";
import { ProfileListContextMenu } from "./profileListContextMenu.tsx";

const StateBatch = ({ profile }: { profile: ScanProfile }) => {
  if (!profile.nextScan) {
    return null;
  }

  if (isRunning(profile.nextScan)) {
    return <AlertBadge status="info">Wird ausgeführt …</AlertBadge>;
  }
  if (isPending(profile.nextScan)) {
    return <AlertBadge status="info">Wird gestartet …</AlertBadge>;
  }
};

export function ProfileListItemView(props: { profile: ScanProfile }) {
  return (
    <ListItemView>
      <Avatar color="blue">
        <IconSubdomain aria-label="" />
      </Avatar>
      <Heading>
        {props.profile.name}
        <StateBatch profile={props.profile} />
      </Heading>
      <Text>
        {props.profile.domain} | {props.profile.standard} | Unterseiten:{" "}
        {props.profile.paths.length}
      </Text>
      {props.profile.lastScan && (
        <Text>
          Letzter Scan: {props.profile.lastScan.completedAt?.toLocaleString()}
        </Text>
      )}
      {props.profile.nextScan && (
        <Text>
          Nächster Scan:{" "}
          {props.profile.nextScan.executionScheduledFor.toLocaleString()}
        </Text>
      )}

      <ProfileListContextMenu profile={props.profile} />
    </ListItemView>
  );
}
