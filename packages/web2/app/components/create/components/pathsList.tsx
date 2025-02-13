import { UseFormReturn } from "react-hook-form";
import { useRef, useState } from "react";
import {
  Align,
  Button,
  FieldError,
  Header,
  Heading,
  Icon,
  IconClose,
  InlineCode,
  Label,
  ListItemView,
  Section,
  Text,
  TextField,
  typedList,
} from "@mittwald/flow-react-components";
import { FormValues } from "../types.ts";
import { extractPathFromUrl, prependPathWithSlash } from "../helpers.ts";
import { IconRowRemove } from "@tabler/icons-react";

export const PathsList = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const [pathInputValue, setPathInputValue] = useState("/");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidInputValue = () => {
    if (!pathInputValue.startsWith("/")) {
      return (
        <Text>
          Muss mit <InlineCode>/</InlineCode> beginnen.
        </Text>
      );
    }
    if (paths.has(pathInputValue)) {
      return "Pfad ist bereits hinzugefügt.";
    }
    return true;
  };

  function addPathToFormValues(value: string) {
    if (isValidInputValue() !== true) {
      return;
    }

    const values = form.getValues("paths");
    values.add(value);
    form.setValue("paths", values);
    setTouched(false);

    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.focus();
    }
  }

  const removePathFromFormValues = (value: string | String) => {
    const values = form.getValues("paths");
    values.delete(value.toString());
    form.setValue("paths", values);
  };

  const paths = form.watch("paths");

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
    <Section>
      <Header>
        <Heading>Unterseiten hinzufügen</Heading>
        <Text>
          Füge Unterseiten hinzu. So kannst du mit einem Profil den Überblick
          über mehrere Seiten deiner Website bekommen.
        </Text>
      </Header>
      <Align>
        <TextField
          ref={inputRef}
          autoFocus={!!form.getValues("domain")}
          onFocus={() => {
            if (inputRef.current) {
              inputRef.current.select();
            }
          }}
          isInvalid={touched && isValidInputValue() !== true}
          value={pathInputValue}
          onChange={(value) => {
            setPathInputValue(value);
            setTouched(true);
          }}
          onPaste={(event) => {
            event.preventDefault();
            const data = event.clipboardData.getData("text");
            const path = prependPathWithSlash(extractPathFromUrl(data));
            setPathInputValue(path);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "NumpadEnter") {
              event.preventDefault();
              addPathToFormValues(pathInputValue);
            }
          }}
        >
          <Label>Pfad</Label>
          {touched && isValidInputValue() !== true && (
            <FieldError>{isValidInputValue()}</FieldError>
          )}
        </TextField>
        <Button
          color="primary"
          isDisabled={isValidInputValue() !== true}
          onPress={() => addPathToFormValues(pathInputValue)}
        >
          Hinzufügen
        </Button>
      </Align>
      {pathsList}
    </Section>
  );
};
