import { ScanProfile } from "../../../../api/types.ts";
import {
  Heading,
  Icon,
  IllustratedMessage,
} from "@mittwald/flow-react-components";
import { IconAccessible } from "@tabler/icons-react";

export function A11yScore({ profile }: { profile: ScanProfile }) {
  return (
    <IllustratedMessage>
      <Icon>
        <IconAccessible />
      </Icon>
      <Heading>Dein A11y-Score: {profile.issueSummary?.score}</Heading>
    </IllustratedMessage>
  );
}
