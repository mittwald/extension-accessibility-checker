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
  TableHeader,
  TableRow,
  Text,
} from "@mittwald/flow-react-components";
import { Route } from "../../../routes/profiles.$profileId.tsx";
import { EditPathsModal } from "../modals/editPaths.tsx";

export const PathSettings = () => {
  const { profile } = Route.useLoaderData();

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
        </TableHeader>
        <TableBody>
          {profile.paths.map((p) => (
            <TableRow key={p}>
              <TableCell>
                {profile.domain}
                {p}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};
