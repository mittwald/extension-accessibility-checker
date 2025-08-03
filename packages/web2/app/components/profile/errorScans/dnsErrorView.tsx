import { FC } from "react";
import { Props } from "./types.js";
import {
  ActionGroup,
  Button,
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-remote-react-components";
import { RestartScanButton } from "./restartScanButton.js";

export const DnsErrorView: FC<Props> = ({ profile, scanId }) => {
  return (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Heading>Domain nicht erreichbar</Heading>
      <Text>
        Die Domain <strong>{profile.domain}</strong> ist nicht erreichbar.{" "}
        <br /> Bitte überprüfe die Schreibweise oder versuche es erneut.
      </Text>
      <ActionGroup>
        <RestartScanButton profile={profile} scanId={scanId} />
        <Button color="primary">Domain bearbeiten</Button>
      </ActionGroup>
    </IllustratedMessage>
  );
};
