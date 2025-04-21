import {
  Label,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { Field } from "@mittwald/flow-remote-react-components/react-hook-form";
import { extractDomainFromUrl } from "../helpers.ts";
import { FormValues } from "../types.ts";
import { UseFormReturn } from "react-hook-form";

export const Domain = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const domain = form.watch("domain");

  return (
    <Section>
      <Field
        name="domain"
        rules={{
          required: "The domain is required",
        }}
      >
        <Text>Gib hier die Domain ein, die gescannt werden soll.</Text>
        <TextField
          value={domain}
          onChange={(value) => form.setValue("domain", value)}
          autoFocus={!form.getValues("domain")}
          isRequired
          onPaste={(event) => {
            event.preventDefault();
            const data = event.clipboardData.getData("text");
            form.setValue("domain", extractDomainFromUrl(data));
          }}
        >
          <Label>Domain</Label>
        </TextField>
      </Field>
    </Section>
  );
};
