import {
  ColumnLayout,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export const EducationCards = () => {
  return (
    <ColumnLayout m={[1, 1]}>
      <LayoutCard>
        <Section>
          <Heading level={2}>Hinweis: Manuell testen</Heading>
          <Text>
            Automatische Scans sind super – aber sie sehen nicht alles. Mache
            dich daher mit den{" "}
            <Link href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank">
              Web Content Accessibility Guidelines
            </Link>{" "}
            vertraut und{" "}
            <Link href="https://web.dev/articles/how-to-review?hl=de" target="_blank">
              überprüfe deine Website
            </Link>{" "}
            zusätzlich manuell.
          </Text>
        </Section>
      </LayoutCard>
      <LayoutCard>
        <Section>
          <Heading level={2}>Barrierefreiheitsstärkungsgesetz</Heading>
          <Text>
            Inhalt, Verpflichtungen und Ausnahmen – Alles dazu erfährst du in
            unserem Blog.
          </Text>
          <Link href="https://www.mittwald.de/blog/webentwicklung-design/barrierefreiheitsstaerkungsgesetz-inhalt-verpflichtungen-und-ausnahmen" target="_blank">
            Blog-Artikel
          </Link>
        </Section>
      </LayoutCard>
    </ColumnLayout>
  );
};
