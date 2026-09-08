import { useFormContext, useWatch } from "react-hook-form";
import { getPathsFromMenu } from "../../actions/domain.ts";
import { Action, Button } from "@mittwald/flow-remote-react-components";
import { extractPathFromUrl } from "../create/helpers.ts";
import { FC, useState } from "react";
import { FormValues } from "../create/types.ts";

export interface GenerateError {
  error: Error;
  domain: string;
}

interface Props {
  onError: (error: GenerateError) => void;
  onSuccess: () => void;
  domain?: string;
}

export const GeneratePathsAction: FC<Props> = (props) => {
  const { onError, onSuccess, domain: domainFromProps } = props;
  const [generatedPaths, setGeneratedPaths] = useState<string[]>([]);

  const form = useFormContext<FormValues>();

  const watchedDomain = useWatch({ control: form.control, name: "domain" });

  const domain = domainFromProps ?? watchedDomain ?? "";

  async function generatePaths() {
    try {
      const values = form
        .getValues("paths")
        .filter((i) => !generatedPaths.includes(i));
      const pathsFromMenu = await getPathsFromMenu({ data: domain ?? "" });

      if (pathsFromMenu) {
        form.setValue("paths", [
          ...Array.from(values),
          ...pathsFromMenu.map((path) => extractPathFromUrl(path)),
        ]);
        setGeneratedPaths(pathsFromMenu);
      }
      onSuccess();
    } catch (error) {
      setGeneratedPaths([]);
      if (error instanceof Error) {
        onError({ error, domain });
      }
      throw error;
    }
  }

  return (
    <Action onAction={generatePaths}>
      <Button isDisabled={Boolean(!domain)} color="success">
        Autom. erkennen
      </Button>
    </Action>
  );
};
