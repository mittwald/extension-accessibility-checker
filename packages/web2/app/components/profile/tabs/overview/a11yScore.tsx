import { getSessionToken } from "@mittwald/ext-bridge/browser";
import { ScanProfile } from "../../../../api/types.ts";
import {
  Action,
  Button,
  Header,
  Heading,
  Label,
  ProgressBar,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export function A11yScore({ profile }: { profile: ScanProfile }) {
  const color = (value: number | undefined) => {
    if (value === undefined) {
      return undefined;
    }
    if (value < 50) {
      return "danger";
    }
    if (value < 90) {
      return "warning";
    }
    return "success";
  };

  const handleDownload = async () => {
    const token = await getSessionToken();
    const response = await fetch(`/api/pdf-export/${profile._id}`, {
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
    <Section>
      <Header>
        <Heading>Scanergebnis</Heading>
        <Action onAction={handleDownload}>
          <Button>PDF generieren</Button>
        </Action>
      </Header>
      <Text>
        Der Barrierefreiheitsscore vermittelt einen groben Eindruck.
        Entscheidend ist die Anzahl und Art von Fehlern, Warnungen und
        Hinweisen, die geprüft und behoben werden müssen.
      </Text>
      <ProgressBar
        value={profile.issueSummary?.score}
        maxValue={100}
        showMaxValue
        status={color(profile.issueSummary?.score)}
        formatOptions={{ style: "decimal" }}
      >
        <Label>Barrierefreiheitsscore</Label>
      </ProgressBar>
    </Section>
  );
}
