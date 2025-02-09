import { Issue } from "../../../api/types.ts";
import {
  Avatar,
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
import wcagLinks from "../../../wcagLinks.json";
import techniquesLinks from "../../../techniquesLinks.json";
import { builders } from "prettier/doc";
import label = builders.label;

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
        <Avatar color="violet" aria-label="Warnung">
          <IconWarning />
        </Avatar>
      );
    case "notice":
      return (
        <Avatar color="violet" aria-label="Hinweis">
          <IconInfo />
        </Avatar>
      );
  }
};

const getLinkForTechnique = (technique: string) => {
  switch (technique.charAt(0)) {
    case "ARIA":
    case "SCR":
    case "C":
    case "F":
    case "G":
    case "H":
      return `https://www.w3.org/WAI/WCAG22/Techniques/html/${technique}`;
    case "PDF":
    case "SVR":
    case "SM":
    case "T":
    default:
      return null;
  }
};

const getIssueMeta = (issue: Issue) => {
  const [wcagLevel, principle, guideline, criterion, techniques, ...rest] =
    issue.errorCode.split(".");
  return {
    wcagLevel,
    principle: principle.replace("Principle", "").replace("_", "."),
    guideline: guideline
      .replace("Guideline", "")
      .replace("_", ".") as keyof typeof wcagLinks,
    criterion: criterion.split("_").join(".") as keyof typeof wcagLinks,
    techniques: techniques.split(",") as (keyof typeof techniquesLinks)[],
    rest,
  };
};

export const IssueListItemView = ({ issue }: { issue: Issue }) => {
  const issueMeta = getIssueMeta(issue);

  const wcagGuidelineLinkData = wcagLinks[issueMeta.guideline];
  const wcagCriterionLinkData = wcagLinks[issueMeta.criterion];
  const techniqueLinksData = issueMeta.techniques.map((technique) => ({
    id: technique,
    url: getLinkForTechnique(technique) ?? undefined,
    label: techniquesLinks[technique],
  }));

  return (
    <ListItemView>
      <IssueAvatar issue={issue} />
      <Heading>{wcagCriterionLinkData?.label ?? issue.errorCode}</Heading>
      <Text>{issueMeta.wcagLevel}</Text>
      <Content slot="bottom">
        <Section>
          <Text>{issue.description}</Text>
          <Heading level={3}>Links</Heading>
          <Text>
            <ul>
              {techniqueLinksData.length > 0 &&
                techniqueLinksData.map(({ url, label, id }) => (
                  <li key={id}>
                    <Link href={url}>
                      Technik {id}: {label}
                    </Link>
                  </li>
                ))}
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
            </ul>
          </Text>
          <Heading level={3}>Vorkommen</Heading>
          {issue.url}
          <CodeBlock code={issue.selector} copyable />
        </Section>
      </Content>
    </ListItemView>
  );
};
