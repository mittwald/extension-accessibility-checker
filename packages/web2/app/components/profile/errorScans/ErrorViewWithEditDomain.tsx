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

export const ErrorViewWithEditDomain: FC<Props> = ({
  profile,
  scanId,
  headline,
  description,
}) => {
  const controller = useOverlayController("Modal");
  const editLabel = "Domain bearbeiten";
  const content =
    description ?? (
      <>
        Kontrolliere die Domain auf Richtigkeit und versuche es erneut.
      </>
    );

  return (
    <IllustratedMessage color="danger">
      <IconDanger />
      <Heading>{headline ?? editLabel}</Heading>
      <Text>{content}</Text>
      <ActionGroup>
        <RestartScanButton profile={profile} scanId={scanId} />
        <Action onAction={() => controller.open()}>
          <Button color="primary">{editLabel}</Button>
        </Action>
      </ActionGroup>
      <ChangeDomainModal
        profile={profile}
        controller={controller}
        title={editLabel}
      />
    </IllustratedMessage>
  );
};
