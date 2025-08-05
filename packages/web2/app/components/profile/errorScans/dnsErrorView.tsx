import { FC } from "react";
import { Props } from "./types.js";
import {
  Action,
  ActionGroup,
  Button,
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { RestartScanButton } from "./restartScanButton.js";
import { ChangeDomainModal } from "../modals/changeDomainModal.js";

export const DnsErrorView: FC<Props> = ({ profile, scanId }) => {
  const controller = useOverlayController("Modal");

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
        <Action onAction={() => controller.open()}>
          <Button color="primary">Domain bearbeiten</Button>
        </Action>
      </ActionGroup>
      <ChangeDomainModal profile={profile} controller={controller} />
    </IllustratedMessage>
  );
};
