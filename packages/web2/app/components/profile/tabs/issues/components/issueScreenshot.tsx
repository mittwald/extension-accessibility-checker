import {
  Action,
  Button,
  Icon,
  Image,
  LightBox,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { getSessionToken } from "@mittwald/ext-bridge/browser";
import { useState } from "react";
import type { IssueScreenshot as ApiIssueScreenshot } from "../../../../../api/types.ts";
import { IconCamera } from "@tabler/icons-react";

interface Props {
  screenshot: ApiIssueScreenshot;
}

export const IssueScreenshot = ({ screenshot }: Props) => {
  const [dataUrl, setDataUrl] = useState<string>();

  const controller = useOverlayController("LightBox");

  const load = async () => {
    if (dataUrl) {
      controller.open();
      return;
    }

    const token = await getSessionToken();
    const response = await fetch(`/api/screenshot/${screenshot.id}`, {
      method: "GET",
      headers: { "x-session-token": token },
    });

    if (!response.ok) {
      throw new Error("Screenshot konnte nicht geladen werden");
    }

    const blob = await response.blob();
    const result = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    setDataUrl(result);
    controller.open();
  };

  return (
    <>
      <Action onAction={load}>
        <Button size="s" variant="soft" color="secondary">
          <Icon>
            <IconCamera />
          </Icon>
          Screenshot anzeigen
        </Button>
      </Action>
      <LightBox controller={controller}>
        <Image src={dataUrl}></Image>
      </LightBox>
    </>
  );
};
