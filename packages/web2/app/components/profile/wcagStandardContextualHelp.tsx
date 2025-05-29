import {
  ContextualHelp,
  Heading,
  Text,
} from "@mittwald/flow-remote-react-components";

export function WcagStandardContextualHelp() {
  return (
    <ContextualHelp>
      <Heading>WCAG Konformitätsstufe</Heading>
      <Text>
        Die WCAG untergliedert die Erfolgskriterien in{" "}
        <strong>drei Konformitätsstufen: A, AA und AAA</strong>.
      </Text>
      <Text>
        Die Erfolgskriterien der <strong>Konformitätsstufe A</strong> bieten
        eine grundlegende Zugänglichkeit und sollten daher mit der höchsten
        Priorität umgesetzt werden. Diese Erfolgskriterien werden auch als
        Mindestanforderung an die Zugänglichkeit bezeichnet.
      </Text>
      <Text>
        Die Erfolgskriterien der <strong>Konformitätsstufe AA</strong> stellen
        in der Europäischen Union den Standard dar. Sie werden auch als
        Anforderungen an gute Zugänglichkeit bezeichnet.
      </Text>
      <Text>
        Erfolgskriterien der <strong>Konformitätsstufe AAA</strong> dienen der
        Schaffung bestmöglicher Zugänglichkeit und sind in Deutschland für
        zentrale Inhalte relevant. Sie werden deshalb als Maximalanforderungen
        oder Anforderungen zur Erreichung der höchstmöglichen Barrierefreiheit
        bezeichnet, sind jedoch nicht allgemein anwendbar.
      </Text>
      <Text>In der Regel ist Konformitätsstufe AA ein guter Benchmark.</Text>
    </ContextualHelp>
  );
}
