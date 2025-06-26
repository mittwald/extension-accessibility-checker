import {
  AccentBox,
  ColumnLayout,
  Flex,
  Heading,
  Image,
  Link,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import martinImage from "../../feedback-person.webp?inline";

export const FeedbackBox = () => {
  return (
    <AccentBox color="gradient">
      <ColumnLayout l={[3, 1]} m={[2, 1]} s={[1, null]}>
        <Section>
          <Heading>Hast du einen Moment für Feedback?</Heading>
          <Text>
            Ich bin Sina, deine Ansprechpartnerin für alles, was den
            Barriere-Checker besser machen kann. Ob kleiner Bug oder große Idee:
            Ich will’s wissen! Gib mir dein Feedback direkt auf GitHub. Dauert
            nur 1&nbsp;Minute, bringt aber richtig was.
          </Text>
          <Link
            target="_blank"
            href="https://github.com/mittwald/extension-accessibility-checker/issues/new"
          >
            Feedback auf GitHub
          </Link>
        </Section>
        <Flex direction="column" align="end">
          <Image src={martinImage} alt="" width={200} />
        </Flex>
      </ColumnLayout>
    </AccentBox>
  );
};
