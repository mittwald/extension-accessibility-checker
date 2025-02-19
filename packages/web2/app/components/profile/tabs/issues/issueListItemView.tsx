import {
  Avatar,
  Badge,
  CodeBlock,
  Content,
  Heading,
  IconDanger,
  IconInfo,
  IconWarning,
  Link,
  ListItemView,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import wcagLinks from "../../../../wcagLinks.json";
import techniquesLinks from "../../../../techniquesLinks.json";
import { getLinkForTechnique } from "./helpers.ts";
import { Issue } from "./types.ts";

const IssueAvatar = ({ issue }: { issue: Issue }) => {
  switch (issue.severity) {
    case "error":
      return (
        <Avatar color="blue" aria-label="Fehler">
          <IconDanger />
        </Avatar>
      );
    case "warning":
      return (
        <Avatar color="lilac" aria-label="Warnung">
          <IconWarning />
        </Avatar>
      );
    case "notice":
      return (
        <Avatar color="teal" aria-label="Hinweis">
          <IconInfo />
        </Avatar>
      );
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
        Level {level} | WCAG Kriterium {issueMeta.criterion}
      </Text>
      <Content slot="bottom">
        <Section>
          <Text>{issue.description}</Text>
          <Heading level={3}>Links</Heading>
          <Text>
            <ul>
              {wcagGuidelineLinkData && (
                <li>
                  <Link href={wcagGuidelineLinkData.understanding}>
                    WCAG Richtlinie {issueMeta.guideline}:{" "}
                    {wcagGuidelineLinkData.label}
                  </Link>
                </li>
              )}
              {wcagCriterionLinkData && (
                <li>
                  <Link href={wcagCriterionLinkData.understanding}>
                    WCAG Kriterium {issueMeta.criterion}:{" "}
                    {wcagCriterionLinkData.label}
                  </Link>
                </li>
              )}
              {techniqueLinksData.length > 0 &&
                techniqueLinksData.map(({ url, label, id }) => (
                  <li key={id}>
                    <Link href={url}>
                      Technik {id}: {label}
                    </Link>
                  </li>
                ))}
            </ul>
          </Text>
          <Heading level={3}>Vorkommen</Heading>
          <ul>
            {issue.selectors.map((o) => (
              <li key={o.selector} style={{ paddingBottom: "1rem" }}>
                <Section>
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
                </Section>
              </li>
            ))}
          </ul>
        </Section>
      </Content>
    </ListItemView>
  );
};
