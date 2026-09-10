import { FC } from "react";
import {
  Field,
  Form,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import {
  Button,
  Combine,
  Label,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { extractPathFromUrl, prependPathWithSlash } from "../helpers.ts";
import { FormValues } from "../types.ts";
import { useForm, useFormContext, useWatch } from "react-hook-form";

interface Props {
  onSubmit: (path: string) => void;
  autofocus?: boolean;
}

interface Values {
  path: string;
}

const defaultValues = { path: "/" };

export const PathInput: FC<Props> = (props) => {
  const { onSubmit, autofocus } = props;

  const parentForm = useFormContext<Pick<FormValues, "paths">>();
  const form = useForm<Values>({ defaultValues });

  const watchedPaths = useWatch({ control: parentForm.control, name: "paths" });
  const watchedNewPath = useWatch({ control: form.control, name: "path" });

  const handleSubmit = ({ path }: Values) => {
    onSubmit(path);
    form.reset(defaultValues);
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Combine>
        <Field
          name="path"
          rules={{
            required: "Bitte gib einen Pfad an, der mit / beginnt",
            validate: {
              startsWithSlash: (path) =>
                path.startsWith("/") ||
                "Bitte gib einen Pfad an, der mit / beginnt",
              isUnique: (path) =>
                !watchedPaths.includes(path) ||
                "Der Pfad ist bereits eingetragen",
            },
          }}
        >
          <TextField
            autoFocus={autofocus}
            isRequired
            onPaste={(event) => {
              const data = event.clipboardData.getData("text");
              const path = prependPathWithSlash(extractPathFromUrl(data));
              setTimeout(() => {
                form.setValue("path", path);
              });
            }}
          >
            <Label>Pfad</Label>
          </TextField>
        </Field>
        <Button
          isDisabled={watchedPaths.includes(watchedNewPath)}
          color="primary"
          type="submit"
        >
          Hinzufügen
        </Button>
      </Combine>
    </Form>
  );
};
