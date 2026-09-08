import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";
import {
  Button,
  Combine,
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

export const PathsList = ({ autoFocus }: { autoFocus: boolean }) => {
  const [pathInputValue, setPathInputValue] = useState("/");
  const [touched, setTouched] = useState(false);

  const form = useFormContext<Pick<FormValues, "paths">>();

  const paths = useWatch({ control: form.control, name: "paths" });

  const isValidPath = (path?: string) => {
    const p = path ?? pathInputValue;
    if (!p.startsWith("/")) {
      return (
        <Text>
          Muss mit <InlineCode>/</InlineCode> beginnen.
        </Text>
      );
    }
    if (paths.includes(p)) {
      return "Pfad ist bereits hinzugefügt.";
    }
    return true;
  };

  const addPathToFormValues = (value: string) => {
    if (isValidPath(value) !== true) {
      return;
    }

    const paths = form.getValues("paths");
    form.setValue("paths", [...paths, value]);
    setTouched(false);
  };

  const removePathFromFormValues = (value: string) => {
    const paths = form.getValues("paths");
    form.setValue(
      "paths",
      paths.filter((i) => value.toString() !== i),
    );
  };

  const PathList = typedList<string>();
  const pathsList = (
    <PathList.List aria-label="Pfade" batchSize={10}>
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
      <Combine>
        <TextField
          autoFocus={autoFocus}
          isInvalid={touched && isValidPath() !== true}
          value={pathInputValue}
          isRequired
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
      </Combine>
      {pathsList}
    </>
  );
};
