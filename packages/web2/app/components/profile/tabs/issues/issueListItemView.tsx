import {
  Avatar,
  Badge,
  CodeBlock,
  Content,
  Flex,
  Heading,
  Link,
  ListItemView,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import wcagLinks from "../../../../wcagLinks.json";
import techniquesLinks from "../../../../techniquesLinks.json";
import { getLinkForTechnique } from "./helpers.ts";
import { Issue } from "./types.ts";

const IssueAvatar = ({ issue }: { issue: Issue }) => {
  switch (issue.severity) {
    case "error":
      return <Avatar status="danger" aria-label="" />;
    case "warning":
      return <Avatar status="warning" aria-label="" />;
    case "notice":
      return <Avatar status="info" aria-label="" />;
  }
};

const IssueSeverityText = ({ issue }: { issue: Issue }) => {
  switch (issue.severity) {
    case "error":
      return "Fehler";
    case "warning":
      return "Warnung";
    case "notice":
      return "Hinweis";
  }
};

export const IssueListItemView = ({ issue }: { issue: Issue }) => {
  const issueMeta = issue.meta;

  const wcagGuidelineLinkData = wcagLinks[issueMeta.guideline];
  const wcagCriterionLinkData = wcagLinks[issueMeta.criterion];
  const techniqueLinksData = issueMeta.techniques
    .map((technique) => ({
      id: technique,
      url: getLinkForTechnique(technique) ?? undefined,
      label: techniquesLinks[technique],
    }))
    .filter((t) => !!t.url);

  const level =
    wcagCriterionLinkData && "wcagLevel" in wcagCriterionLinkData
      ? wcagCriterionLinkData.wcagLevel
      : "N/A";

  return (
    <ListItemView>
      <IssueAvatar issue={issue} />
      <Heading>
        {wcagCriterionLinkData?.label ?? issue.errorCode}
        <Badge>{issue.count}×</Badge>
      </Heading>
      <Text>
        <IssueSeverityText issue={issue} /> | Level {level} | WCAG Kriterium{" "}
        {issueMeta.criterion}
      </Text>
      <Content slot="bottom">
        <Section>
          <Text>{issue.description}</Text>
          <Heading level={3}>Links</Heading>
          <Text>
            <ul>
              {wcagGuidelineLinkData && (
                <li>
                  <Link
                    href={wcagGuidelineLinkData.understanding}
                    target="_blank"
                    rel="noopener"
                  >
                    WCAG Richtlinie {issueMeta.guideline}:{" "}
                    {wcagGuidelineLinkData.label}
                  </Link>
                </li>
              )}
              {wcagCriterionLinkData && (
                <li>
                  <Link
                    href={wcagCriterionLinkData.understanding}
                    target="_blank"
                    rel="noopener"
                  >
                    WCAG Kriterium {issueMeta.criterion}:{" "}
                    {wcagCriterionLinkData.label}
                  </Link>
                </li>
              )}
              {techniqueLinksData.length > 0 &&
                techniqueLinksData.map(({ url, label, id }) => (
                  <li key={id}>
                    <Link href={url} target="_blank" rel="noopener">
                      Technik {id}: {label}
                    </Link>
                  </li>
                ))}
            </ul>
          </Text>
          <Heading level={3}>Vorkommen</Heading>
          <ul>
            {issue.selectors.map((o) => (
              <li key={o.selector}>
                <Flex rowGap="s" paddingBottom="l" direction="column">
                  {o.selector && <CodeBlock code={o.selector} copyable />}
                  {o.context && (
                    <CodeBlock code={o.context} language="html" copyable />
                  )}
                  <Text>
                    <ul>
                      {o.urls.map((url) => (
                        <li key={url}>{url}</li>
                      ))}
                    </ul>
                  </Text>
                </Flex>
              </li>
            ))}
          </ul>
        </Section>
      </Content>
    </ListItemView>
  );
};
