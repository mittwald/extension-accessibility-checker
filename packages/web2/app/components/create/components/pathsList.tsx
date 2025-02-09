import { UseFormReturn } from "react-hook-form";
import { useRef, useState } from "react";
import {
  Button,
  Header,
  Heading,
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
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidInputValue = () => {
    return false;
  };

  function addPathToFormValues(value: string) {
    const values = form.getValues("paths");
    values.add(value);
    form.setValue("paths", values);

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
            <Text>{path}</Text>
            {path !== "/" && (
              <Button
                variant="plain"
                color="secondary"
                size="m"
                onPress={() => removePathFromFormValues(path)}
              >
                <IconRowRemove />
              </Button>
            )}
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
      <TextField
        autoFocus={!!form.getValues("domain")}
        onFocus={() => {
          if (inputRef.current) {
            inputRef.current.select();
          }
        }}
        ref={inputRef}
        validate={(value) => {
          if (!value.startsWith("/")) {
            return "Muss mit `/` beginnen.";
          }
          if (paths.has(value)) {
            return "Pfad ist bereits hinzugefügt.";
          }
          return true;
        }}
        isInvalid={isValidInputValue()}
        value={pathInputValue}
        onChange={(value) => setPathInputValue(value)}
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
      </TextField>
      <Button
        color="primary"
        onPress={() => addPathToFormValues(pathInputValue)}
      >
        Hinzufügen
      </Button>
      {pathsList}
    </Section>
  );
};
