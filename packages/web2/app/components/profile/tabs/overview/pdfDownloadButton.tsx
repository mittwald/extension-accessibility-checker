import { Action, Button } from "@mittwald/flow-remote-react-components";
import { getSessionToken } from "@mittwald/ext-bridge/browser";
import { FC } from "react";

interface PdfDownloadButtonProps {
  profileId: string;
}

export const PdfDownloadButton: FC<PdfDownloadButtonProps> = ({
  profileId,
}) => {
  const handleDownload = async () => {
    const token = await getSessionToken();
    const response = await fetch(`/api/pdf-export/${profileId}`, {
      method: "GET",
      headers: {
        "x-session-token": token,
      },
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Barriere-Report.pdf`);
    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Action onAction={handleDownload}>
      <Button>PDF generieren</Button>
    </Action>
  );
};
