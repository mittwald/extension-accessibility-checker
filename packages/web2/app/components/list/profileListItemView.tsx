import { ScanProfile } from "../../api/types.ts";
import { isPending, isRunning } from "../profile/helpers.ts";
import {
  AlertBadge,
  Avatar,
  Heading,
  IconDomain,
  ListItemView,
  Text,
} from "@mittwald/flow-remote-react-components";
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
        <IconDomain aria-label="" />
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
      <Text>
        Score:{" "}
        {props.profile.issueSummary?.score ?? "unbekannt wegen Scanfehler"}
      </Text>
      <ProfileListContextMenu profile={props.profile} />
    </ListItemView>
  );
}
