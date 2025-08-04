import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import {
  Align,
  Button,
  FieldError,
  IconClose,
  InlineCode,
  Label,
  ListItemView,
  Text,
  TextField,
  typedList,
} from "@mittwald/flow-remote-react-components";
import { FormValues } from "../types.ts";
import { extractPathFromUrl, prependPathWithSlash } from "../helpers.ts";
import { GeneratePaths } from "./generatePaths.js";

type PathFormValues = Pick<FormValues, "paths">;

export const PathsList = ({
  form,
  autoFocus,
}: {
  form: UseFormReturn<PathFormValues>;
  autoFocus: boolean;
}) => {
  const [pathInputValue, setPathInputValue] = useState("/");
  const [touched, setTouched] = useState(false);

  const paths = form.watch("paths");

  const isValidPath = (path?: string) => {
    const p = path ?? pathInputValue;
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
    setTouched(false);
  };

  const removePathFromFormValues = (value: string | String) => {
    const values = form.getValues("paths");
    values.delete(value.toString());
    form.setValue("paths", values);
  };

  const PathList = typedList<String>();
  const pathsList = (
    <PathList.List aria-label="Pfade">
      <PathList.StaticData data={Array.from(paths)} />

      <PathList.Item textValue={(p) => p.toString()}>
        {(path) => (
          <ListItemView>
            <Text>
              <strong>{path}</strong>
            </Text>
            <Button
              variant="plain"
              color="secondary"
              size="m"
              isDisabled={path === "/"}
              onPress={() => removePathFromFormValues(path)}
            >
              <IconClose />
            </Button>
          </ListItemView>
        )}
      </PathList.Item>
    </PathList.List>
  );

  return (
    <>
      <Align>
        <TextField
          autoFocus={autoFocus}
          isInvalid={touched && isValidPath() !== true}
          value={pathInputValue}
          onChange={(value) => {
            setPathInputValue(value);
            setTouched(true);
          }}
          onPaste={(event) => {
            const data = event.clipboardData.getData("text");
            const path = prependPathWithSlash(extractPathFromUrl(data));
            setTimeout(() => {
              setPathInputValue(path);
            });
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "NumpadEnter") {
              event.preventDefault();
              addPathToFormValues(pathInputValue);
            }
          }}
        >
          <Label>Pfad</Label>
          {touched && isValidPath() !== true && (
            <FieldError>{isValidPath()}</FieldError>
          )}
        </TextField>
        <Button
          color="primary"
          isDisabled={isValidPath() !== true}
          onPress={() => addPathToFormValues(pathInputValue)}
        >
          Hinzufügen
        </Button>
      </Align>
      {pathsList}
      <GeneratePaths form={form} onAdd={addPathToFormValues} />
    </>
  );
};
