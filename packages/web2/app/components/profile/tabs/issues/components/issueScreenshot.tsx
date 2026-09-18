import {
  Action,
  Button,
  Icon,
  Image,
  Skeleton,
} from "@mittwald/flow-remote-react-components";
import { getSessionToken } from "@mittwald/ext-bridge/browser";
import { useState } from "react";
import type { IssueScreenshot as ApiIssueScreenshot } from "../../../../../api/types.ts";
import { IconCamera } from "@tabler/icons-react";

interface IssueScreenshotProps {
  screenshot: ApiIssueScreenshot;
  url: string;
}

export const IssueScreenshot = ({ screenshot, url }: IssueScreenshotProps) => {
  const [dataUrl, setDataUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const maxDisplayWidth = 720;
  const scale = Math.min(1, maxDisplayWidth / screenshot.width);
  const width = Math.round(screenshot.width * scale);
  const height = Math.round(screenshot.height * scale);

  const load = async () => {
    setIsLoading(true);
    setIsFailed(false);

    try {
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
    } catch {
      setIsFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (dataUrl) {
    return (
      <Image
        height={height}
        width={width}
        src={dataUrl}
        alt={`Screenshot der Fehlerstelle auf ${url}`}
        withBorder
      />
    );
  }

  if (isLoading) {
    return <Skeleton width={width} height={height} />;
  }

  return (
    <Action onAction={load}>
      <Button size="s" variant="soft" color="secondary" isFailed={isFailed}>
        <Icon>
          <IconCamera />
        </Icon>
        Screenshot anzeigen
      </Button>
    </Action>
  );
};
