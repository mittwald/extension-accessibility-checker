import {
  Button,
  Header,
  Heading,
  ModalTrigger,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
  Text,
  Flex,
} from "@mittwald/flow-remote-react-components";
import { Route } from "../../../../routes/profiles.$profileId.tsx";
import { EditPathsModal } from "../../modals/editPaths.tsx";

export const PathSettings = () => {
  const { profile, lastScan } = Route.useLoaderData();

  const getScoreForPath = (path: string) => {
    const score = lastScan?.pages.find(
      (page) => page.url === `https://${profile.domain}${path}`,
    )?.score;
    return score ?? "–";
  };

  return (
    <Section>
      <Header>
        <Heading>Unterseiten</Heading>
        <ModalTrigger>
          <Button color="secondary" variant="soft">
            Bearbeiten
          </Button>
          <EditPathsModal profile={profile} />
        </ModalTrigger>
      </Header>
      <Text>
        Füge Unterseiten zu deinem Scanprofil hinzu, um genauere Messergebnisse
        zu erzielen – beachte jedoch, dass Änderungen deine
        Barrierefreiheitsbewertung erheblich beeinflussen können.
      </Text>
      <Table>
        <TableHeader>
          <TableColumn>Pfad</TableColumn>
          <TableColumn>Score</TableColumn>
        </TableHeader>
        <TableBody>
          {profile.paths.map((p) => (
            <TableRow key={p}>
              <TableCell> {p} </TableCell>
              <TableCell>{getScoreForPath(p)}</TableCell>
            </TableRow>
          ))}
          <TableFooterRow>
            <TableCell>
              <strong>Gesamtbewertung</strong>
            </TableCell>
            <TableCell>
              <Flex wrap="nowrap" gap="xs">
                <strong>Ø</strong>
                <strong>{profile.issueSummary?.score}</strong>
              </Flex>
            </TableCell>
          </TableFooterRow>
        </TableBody>
      </Table>
    </Section>
  );
};
