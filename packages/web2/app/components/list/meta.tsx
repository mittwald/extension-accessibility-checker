import {
  ColumnLayout,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export const Meta = () => {
  return (
    <ColumnLayout m={[1, 1]}>
      <LayoutCard>
        <Section>
          <Heading level={2}>Manuell testen</Heading>
          <Text>
            Eine automatisierter Scan kann nicht alle Kriterien der WCAG 2
            erfassen.{" "}
            <Link href="https://web.dev/articles/how-to-review?hl=de">
              Teste daher auch immer manuell
            </Link>
            .
          </Text>
        </Section>
      </LayoutCard>
      <LayoutCard>
        <Section>
          <Heading level={2}>Barrierefreiheitsstärkungsgesetz</Heading>
          <Text>
            Im Juni tritt das
            Barriere&shy;frei&shy;heits&shy;stärkungs&shy;gesetz (BFSG) in
            Kraft. Im Blog findest du mehr Informationen dazu und kannst
            nachlesen ob dein Projekt betroffen ist.
          </Text>
          <Link href="https://www.mittwald.de/blog/webentwicklung-design/barrierefreiheitsstaerkungsgesetz-inhalt-verpflichtungen-und-ausnahmen">
            Blog-Artikel
          </Link>
        </Section>
      </LayoutCard>
    </ColumnLayout>
  );
};
