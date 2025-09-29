import { FC } from "react";
import { DetailedErrorProps } from "./types.js";
import {
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-remote-react-components";
import { RestartScanButton } from "./restartScanButton.js";

export const ErrorViewWithoutEditDomain: FC<DetailedErrorProps> = ({
  profile,
  headline,
  description,
  scanId,
}) => {
  return (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Heading>{headline}</Heading>
      <Text>{description}</Text>
      <RestartScanButton profile={profile} scanId={scanId} />
    </IllustratedMessage>
  );
};
