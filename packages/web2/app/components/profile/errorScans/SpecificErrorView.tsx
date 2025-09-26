import { FC } from "react";
import { Props } from "./types.js";
import {
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-remote-react-components";
import { RestartScanButton } from "./restartScanButton.js";

export const SpecificErrorView: FC<Props> = ({
  profile,
  headline,
  description,
  scanId,
}) => {
  return (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Heading>{headline ?? "Letzter Scan fehlgeschlagen"}</Heading>
      <Text>
        {description ?? (
          <>
            Beim Scan ist folgender Fehler aufgetreten.
            <br />
            Bitte versuche es erneut.
          </>
        )}
      </Text>
      <RestartScanButton profile={profile} scanId={scanId} />
    </IllustratedMessage>
  );
};
