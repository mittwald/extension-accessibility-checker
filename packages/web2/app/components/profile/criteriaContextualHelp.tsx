import {
  ContextualHelp,
  Heading,
  Text,
} from "@mittwald/flow-remote-react-components";

export function CriteriaContextualHelp() {
  return (
    <ContextualHelp>
      <Heading>Kriterien</Heading>
      <Text>
        Wähle die Kriterien, die im Scan erfasst werden sollen. Fehler sind von kritischer Bedeutung und werden immer ermittelt; Warnungen und Hinweise können optional aktiviert werden. 
      </Text>
    </ContextualHelp>
  );
}
