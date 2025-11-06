import { UseFormReturn, useWatch } from "react-hook-form";
import { getPathsFromMenu } from "../../../actions/domain.js";
import {
  Action,
  Button,
  InlineCode,
  Text,
} from "@mittwald/flow-remote-react-components";
import { extractPathFromUrl } from "../helpers.js";
import { useState } from "react";

export const GeneratePathsAction = (props: { form: UseFormReturn }) => {
  const { form } = props;
  const [isFetching, setFetching] = useState(false);
  const [generatedPaths, setGeneratedPaths] = useState<string[]>([]);

  const paths = useWatch({ control: form.control, name: "paths" });
  const domain = useWatch({ control: form.control, name: "domain" });

  const isValidPath = (path: string) => {
    const p = path;
    if (!p.startsWith("/")) {
      return (
        <Text>
          Muss mit <InlineCode>/</InlineCode> beginnen.
        </Text>
      );
    }
    if (paths.has(p)) {
      return "Pfad ist bereits hinzugefügt.";
    }
    return true;
  };

  const addPathToFormValues = (value: string) => {
    if (isValidPath(value) !== true) {
      return;
    }

    const values = form.getValues("paths");
    values.add(value);
    form.setValue("paths", values);
  };

  async function generatePaths() {
    setFetching(true);
    try {
      const sitemap = await getPathsFromMenu({ data: domain ?? "" });
      if (sitemap) {
        const values = form.getValues("paths");
        generatedPaths.forEach((generatedPath) => {
          values.delete(generatedPath);
        });
        form.setValue("paths", values);
        sitemap.forEach((path: string) => {
          addPathToFormValues(extractPathFromUrl(path));
        });
        setGeneratedPaths(sitemap);
      }
    } finally {
      setFetching(false);
    }
  }

  if (!domain) {
    return null;
  }

  return (
    <Action
      onAction={() => {
        generatePaths();
      }}
    >
      <Button isPending={isFetching} color="accent">
        Autom. erkennen
      </Button>
    </Action>
  );
};
