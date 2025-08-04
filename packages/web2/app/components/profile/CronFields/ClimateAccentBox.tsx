import {
  AccentBox,
  Heading,
  Icon,
  Link,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { IconLeaf } from "@tabler/icons-react";
import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { isSmallIntervall } from "./lib";

interface Props {
  form: UseFormReturn;
  cronFieldName: string;
}

export const ClimateAccentBox: FC<Props> = (props) => {
  const { form, cronFieldName } = props;

  const watchedCron = useWatch({
    control: form.control,
    name: cronFieldName,
  });

  const smallInterval = isSmallIntervall(watchedCron);

  if (!smallInterval) {
    return null;
  }

  return (
    <AccentBox color="green">
      <Icon>
        <IconLeaf />
      </Icon>
      <Section>
        <Heading color="dark" level={3}>
          Der Scan läuft sehr häufig
        </Heading>
        <Text color="dark">
          Bitte überlege, ob der Scan weniger oft laufen kann. Das spart Energie
          und schützt das Klima. Du kannst natürlich jederzeit manuell einen
          Scan starten.
        </Text>
        <Link
          color="dark"
          href="https://www.mittwald.de/blog/nachhaltigkeit/warum-es-der-umwelt-hilft-wenn-du-cronjobs-clever-timest-und-reduzierst"
          target="_blank"
        >
          Blogartikel mit Hintergrund-Informationen
        </Link>
      </Section>
    </AccentBox>
  );
};
