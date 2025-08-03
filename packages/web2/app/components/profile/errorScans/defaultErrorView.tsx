import { FC } from "react";
import { Props } from "./types.js";
import {
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-remote-react-components";
import { RestartScanButton } from "./restartScanButton.js";

export const DefaultErrorView: FC<Props & { message: string }> = ({
  profile,
  message,
  scanId,
}) => {
  return (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Heading>Letzter Scan fehlgeschlagen</Heading>
      <Text>
        Beim Scan ist folgender Fehler aufgetreten:
        <br />
        {message}
      </Text>
      <RestartScanButton profile={profile} scanId={scanId} />
    </IllustratedMessage>
  );
};
