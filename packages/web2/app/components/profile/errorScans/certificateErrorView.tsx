import { FC } from "react";
import { Props } from "./types.js";
import {
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-remote-react-components";
import { RestartScanButton } from "./restartScanButton.js";

export const CertificateErrorView: FC<Props> = ({ profile, scanId }) => {
  return (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Heading>SSL-Zertifikat ungültig</Heading>
      <Text>
        Das SSL-Zertifikat der Domain <strong>{profile.domain}</strong> ist
        ungültig. <br /> Binde ein gültiges Zertifikat ein und starte den Scan
        erneut.
      </Text>
      <RestartScanButton profile={profile} scanId={scanId} />
    </IllustratedMessage>
  );
};
