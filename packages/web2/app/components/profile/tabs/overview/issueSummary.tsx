import { ScanProfile } from "../../../../api/types.ts";
import {
  AccentBox,
  BigNumber,
  ColumnLayout,
  Flex,
  Text,
} from "@mittwald/flow-remote-react-components";

export function IssueSummary({ profile }: { profile: ScanProfile }) {
  return (
    <ColumnLayout m={[2, 2]}>
      <AccentBox color="neutral">
        <Flex direction="column" gap="s" align="center" text-align="center">
          <BigNumber>
            <Text>{profile.issueSummary?.errors}</Text>
            <Text>Fehler</Text>
          </BigNumber>
          {profile.issueSummary?.errors === 0 ? (
            <Text>🎉 🥳</Text>
          ) : (
            <Text align="center">
              kritische Fehler, die mit höchster Priorität behoben werden
              sollten
            </Text>
          )}
        </Flex>
      </AccentBox>
      <AccentBox color="neutral">
        <Flex direction="column" gap="xs" align="center">
          <BigNumber>
            <Text>{profile.issueSummary?.warnings}</Text>
            <Text>Warnungen</Text>
          </BigNumber>
          <Text align="center">
            Punkte, die überprüft und bei Bedarf verbessert werden sollten
          </Text>
        </Flex>
      </AccentBox>
    </ColumnLayout>
  );
}
