import {
  Heading,
  IconCheck,
  IllustratedMessage,
  Link,
  Text,
} from "@mittwald/flow-remote-react-components";

export const NoIssues = () => (
  <IllustratedMessage>
    <IconCheck />
    <Heading wrap="balance">
      Keine Fehler, Warnungen oder Hinweise erkannt
    </Heading>
    <Text wrap="balance">
      Ein automatisierter Scan deckt jedoch nicht alle WCAG 2-Kriterien ab.
      Manuelle Prüfungen bleiben weiterhin wichtig. Kontrolliere zusätzlich die
      Filter-Einstellungen, um sicher zu sein, dass keine Fehler vorliegen.
    </Text>
    <Link href="https://web.dev/articles/how-to-review?hl=de">
      Wie man manuell testet
    </Link>
  </IllustratedMessage>
);
