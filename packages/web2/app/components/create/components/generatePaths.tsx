import { useFormContext, useWatch } from "react-hook-form";
import { getPathsFromMenu } from "../../../actions/domain.js";
import { Action, Button } from "@mittwald/flow-remote-react-components";
import { extractPathFromUrl } from "../helpers.js";
import { FC, useState } from "react";
import { FormValues } from "../types.ts";

export interface GenerateError {
  error: Error;
  domain: string;
}

interface Props {
  onError: (error: GenerateError) => void;
  onSuccess: () => void;
}

export const GeneratePathsAction: FC<Props> = (props) => {
  const { onError, onSuccess } = props;
  const [generatedPaths, setGeneratedPaths] = useState<string[]>([]);

  const form = useFormContext<FormValues>();

  const domain = useWatch({ control: form.control, name: "domain" });

  async function generatePaths() {
    try {
      const values = form.getValues("paths");
      generatedPaths.forEach((generatedPath) => {
        values.delete(generatedPath);
      });
      const pathsFromMenu = await getPathsFromMenu({ data: domain ?? "" });
      if (pathsFromMenu) {
        form.setValue(
          "paths",
          new Set([
            ...Array.from(values),
            ...pathsFromMenu.map((path) => extractPathFromUrl(path)),
          ]),
        );
        setGeneratedPaths(pathsFromMenu);
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
      <Button isDisabled={Boolean(!domain)} color="success">
        Autom. erkennen
      </Button>
    </Action>
  );
};
