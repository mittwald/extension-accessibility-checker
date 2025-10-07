import { Route } from "../../../../routes/profiles.$profileId.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
} from "@mittwald/flow-remote-react-components";

export const PathResultsTable = () => {
  const { profile, lastScan } = Route.useLoaderData();

  if (!lastScan) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableColumn>Titel</TableColumn>
        <TableColumn>Pfad</TableColumn>
        <TableColumn>Fehler</TableColumn>
        <TableColumn>Warnungen</TableColumn>
        <TableColumn>Score</TableColumn>
      </TableHeader>

      <TableBody>
        {lastScan.pages.map((p) => {
          const url = new URL(p.url);
          return (
            <TableRow key={p.url}>
              <TableCell>{p.title}</TableCell>
              <TableCell>
                {profile.domain}
                {url.pathname}
              </TableCell>
              <TableCell>{p.issues?.errors ?? "–"}</TableCell>
              <TableCell>{p.issues?.warnings ?? "–"}</TableCell>
              <TableCell>{p.score ?? "–"}</TableCell>
            </TableRow>
          );
        })}

        <TableFooterRow>
          <TableCell>
            <strong>Gesamtbewertung</strong>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <strong>Ø {profile.issueSummary?.score}</strong>
          </TableCell>
        </TableFooterRow>
      </TableBody>
    </Table>
  );
};
