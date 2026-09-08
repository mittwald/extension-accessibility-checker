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
import { useForm, useFormContext } from "react-hook-form";

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
            required: "Der Pfad ist erforderlich.",
            validate: {
              startsWithSlash: (path) =>
                path.startsWith("/") || "Der Pfad muss mit / beginnen.",
              isUnique: (path) =>
                !parentForm.getValues("paths").includes(path) ||
                "Pfad ist bereits hinzugefügt.",
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
        <Button color="primary" type="submit">
          Hinzufügen
        </Button>
      </Combine>
    </Form>
  );
};
