import { ErrorRouteComponent, Link } from "@tanstack/react-router";
import { RootDocument } from "./rootDocument.tsx";
import {
  Breadcrumb,
  CodeBlock,
  ColumnLayout,
  Content,
  Heading,
  InlineCode,
  Label,
  LabeledValue,
  LayoutCard,
  Section,
} from "@mittwald/flow-react-components";

export const ErrorRoot: ErrorRouteComponent = ({ error, info }) => {
  return (
    <RootDocument>
      <ColumnLayout s={[1]}>
        <Breadcrumb color="light">
          <Link to="/">Projekt</Link>
          <Link to="/">A11y Checker</Link>
        </Breadcrumb>
        <Heading level={1} color="light">
          A11y Checker
        </Heading>
        <LayoutCard>
          <Section>
            <ColumnLayout>
              <LabeledValue>
                <Label>Info</Label>
                <Content>{info?.toString()}</Content>
              </LabeledValue>
              <LabeledValue>
                <Label>Error</Label>
                <Content>{error.name}</Content>
              </LabeledValue>
              <LabeledValue>
                <Label>Message</Label>
                <Content>
                  <InlineCode>{error.message}</InlineCode>
                </Content>
              </LabeledValue>
            </ColumnLayout>
            <CodeBlock code={error.stack ?? ""} copyable />
          </Section>
        </LayoutCard>
      </ColumnLayout>
    </RootDocument>
  );
};
