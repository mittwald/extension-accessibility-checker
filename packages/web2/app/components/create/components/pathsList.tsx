import { useFormContext, useWatch } from "react-hook-form";
import {
  Button,
  IconClose,
  ListItemView,
  Text,
  typedList,
} from "@mittwald/flow-remote-react-components";
import { FormValues } from "../types.ts";
import { PathInput } from "./PathInput.tsx";

export const PathsList = ({ autoFocus }: { autoFocus: boolean }) => {
  const form = useFormContext<Pick<FormValues, "paths">>();

  const paths = useWatch({ control: form.control, name: "paths" });

  const addPath = (path: string) =>
    form.setValue("paths", [...form.getValues("paths"), path]);

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
      <PathInput autofocus={autoFocus} onSubmit={(path) => addPath(path)} />
      {pathsList}
    </>
  );
};
