import { Action, Button, Image } from "@mittwald/flow-remote-react-components";
import { getSessionToken } from "@mittwald/ext-bridge/browser";
import { useState } from "react";

interface IssueScreenshotProps {
  screenshot: string;
  url: string;
}

export const IssueScreenshot = ({ screenshot, url }: IssueScreenshotProps) => {
  const [dataUrl, setDataUrl] = useState<string>();

  const load = async () => {
    const token = await getSessionToken();
    const response = await fetch(`/api/screenshot/${screenshot}`, {
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
  };

  if (dataUrl) {
    return (
      <Image
        height={300}
        width={300}
        src={dataUrl}
        alt={`Screenshot der Fehlerstelle auf ${url}`}
        withBorder
      />
    );
  }

  return (
    <Action onAction={load}>
      <Button variant="soft" color="secondary">
        Screenshot anzeigen
      </Button>
    </Action>
  );
};
