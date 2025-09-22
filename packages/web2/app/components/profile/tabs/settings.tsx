import { GeneralSettings } from "./settings/general.tsx";
import { IntarvallSettings } from "./settings/intervall.tsx";
import { PathSettings } from "./settings/paths.tsx";
import { CurrentScan } from "../currentScan.tsx";
import { Flex } from "@mittwald/flow-remote-react-components";

export const Settings = () => {
  return (
    <Flex direction="column">
      <CurrentScan />
      <GeneralSettings />
      <IntarvallSettings />
      <PathSettings />
    </Flex>
  );
};
