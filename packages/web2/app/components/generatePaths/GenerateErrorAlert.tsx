import {
  Alert,
  Content,
  Heading,
  InlineCode,
  Text,
} from "@mittwald/flow-remote-react-components";
import { FC } from "react";
import { GenerateError } from "./generatePaths.tsx";

interface Props {
  generateError: GenerateError;
}

export const GenerateErrorAlert: FC<Props> = (props) => {
  const { generateError } = props;
  return (
    <Alert status="danger">
      <Heading>Unterseiten nicht automatisch erkannt</Heading>
      <Content>
        <Text>
          Die Unterseiten für <InlineCode>{generateError.domain}</InlineCode>{" "}
          konnten nicht automatisch erkannt werden. Überprüfe die eingegebene
          Domain und versuche es erneut.
        </Text>
      </Content>
    </Alert>
  );
};
