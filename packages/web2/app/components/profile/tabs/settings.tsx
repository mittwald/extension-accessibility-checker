import { GeneralSettings } from "./settings/general.tsx";
import { PathSettings } from "./settings/paths.tsx";
import { CurrentScan } from "../currentScan.tsx";
import { Section } from "@mittwald/flow-remote-react-components";

export const Settings = () => {
  return (
    <Section>
      <CurrentScan />
      <GeneralSettings />
      <PathSettings />
    </Section>
  );
};
