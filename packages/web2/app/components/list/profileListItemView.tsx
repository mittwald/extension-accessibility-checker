import { ScanProfile } from "../../api/types.ts";
import { isPending, isRunning } from "../profile/helpers.ts";
import {
  AlertBadge,
  Avatar,
  Content,
  Heading,
  IconDomain,
  Label,
  ListItemView,
  ProgressBar,
  Text,
} from "@mittwald/flow-remote-react-components";
import { ProfileListContextMenu } from "./profileListContextMenu.tsx";
import { FC } from "react";

const ProgressBarColumn: FC<{ score: number | undefined }> = ({ score }) => {
  const progessbarStatus = (value: number) => {
    if (value < 50) {
      return "danger";
    }
    if (value < 90) {
      return "warning";
    }
    return "success";
  };

  if(score === undefined) {
    return
  }

  return (
    <ProgressBar
      size="s"
      value={score}
      status={progessbarStatus(score)}
      maxValue={100}
      showMaxValue
      formatOptions={{}}
    >
      <Label>Score</Label>
    </ProgressBar>
  )
}

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
    <ListItemView s={[3, 1]}>
      <Avatar color="blue">
        <IconDomain aria-label="" />
      </Avatar>
      <Heading>
        {props.profile.name}
        <StateBatch profile={props.profile} />
      </Heading>
      {props.profile.lastScan && (
        <Text>
          Letzter Scan: {props.profile.lastScan.completedAt?.toLocaleString()}
        </Text>
      )}
      <Text>{props.profile.standard}</Text>
      <Content>
        <ProgressBarColumn score={props.profile.issueSummary?.score} />
      </Content>
      <ProfileListContextMenu profile={props.profile} />
    </ListItemView>
  );
}
