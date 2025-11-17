import { UseFormReturn, useWatch } from "react-hook-form";
import { getPathsFromMenu } from "../../../actions/domain.js";
import { Action, Button } from "@mittwald/flow-remote-react-components";
import { extractPathFromUrl } from "../helpers.js";
import { FC, useState } from "react";

export interface GenerateError {
  error: Error;
  domain: string;
}

interface Props {
  form: UseFormReturn;
  onError: (error: GenerateError) => void;
  onSuccess: () => void;
}

export const GeneratePathsAction: FC<Props> = (props) => {
  const { form, onError, onSuccess } = props;
  const [generatedPaths, setGeneratedPaths] = useState<string[]>([]);

  const domain = useWatch({ control: form.control, name: "domain" });

  async function generatePaths() {
    try {
      const values = form.getValues("paths");
      generatedPaths.forEach((generatedPath) => {
        values.delete(generatedPath);
      });
      const sitemap = await getPathsFromMenu({ data: domain ?? "" });
      if (sitemap) {
        form.setValue(
          "paths",
          new Set([
            ...Array.from(values),
            ...sitemap.map((path) => extractPathFromUrl(path)),
          ]),
        );
        setGeneratedPaths(sitemap);
      }
      onSuccess();
    } catch (error) {
      setGeneratedPaths([]);
      if (error instanceof Error) {
        onError({
          error,
          domain,
        });
      }
      throw error;
    }
  }

  return (
    <Action onAction={generatePaths}>
      <Button isDisabled={Boolean(!domain)} color="accent">
        Autom. erkennen
      </Button>
    </Action>
  );
};
