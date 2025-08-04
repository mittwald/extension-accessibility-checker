import { UseFormReturn, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getPaths } from "../../../actions/domain.js";
import { Action, Button } from "@mittwald/flow-remote-react-components";
import { extractPathFromUrl } from "../helpers.js";

export const GeneratePaths = (props: {
  form: UseFormReturn;
  onAdd: (value: string) => void;
}) => {
  const { form, onAdd } = props;
  const domain = useWatch({ control: form.control, name: "domain" });

  const { data: sitemap, isLoading } = useQuery({
    queryKey: ["sitemap", domain],
    queryFn: () => getPaths({ data: domain ?? "" }),
    enabled: !!domain,
  });

  if (!domain || !sitemap) {
    return null;
  }

  return (
    <Action
      onAction={() => {
        sitemap?.forEach((path: string) => {
          onAdd(extractPathFromUrl(path));
        });
      }}
    >
      <Button isDisabled={isLoading}>
        {isLoading ? "Lädt..." : "Generieren"}
      </Button>
    </Action>
  );
};
