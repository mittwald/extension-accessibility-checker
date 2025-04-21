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
    <Heading>Keine Fehler, Warnungen oder Hinweise gefunden.</Heading>
    <Text>
      Passe die Filter an und denke daran: Ein automatisierter Scan kann nicht
      alle Kriterien der WCAG 2 erfassen. Teste daher auch immer manuell.
    </Text>
    <Link href="https://web.dev/articles/how-to-review?hl=de">
      Wie man manuell testet
    </Link>
  </IllustratedMessage>
);
