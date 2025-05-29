import { ScanProfile } from "../../../../api/types.ts";
import {
  Heading,
  Icon,
  IllustratedMessage,
  ProgressBar,
} from "@mittwald/flow-remote-react-components";
import { IconAccessible } from "@tabler/icons-react";

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

  return (
    <IllustratedMessage>
      <Icon>
        <IconAccessible />
      </Icon>
      <Heading>Dein Barrierefreiheits-Score</Heading>
      <ProgressBar
        value={profile.issueSummary?.score}
        maxValue={100}
        showMaxValue
        status={color(profile.issueSummary?.score)}
        formatOptions={{ style: "decimal" }}
      ></ProgressBar>
    </IllustratedMessage>
  );
}
