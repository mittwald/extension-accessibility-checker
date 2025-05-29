import {
  FieldDescription,
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
          pattern: {
            value:
              /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
            message:
              "Bitte gib die Domain ohne Protokoll ein. Beispiel: www.example.com oder example.com",
          },
          required: "Die Domain ist erforderlich.",
        }}
      >
        <Text>Gib hier die Domain deiner Website ein.</Text>
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
          <FieldDescription>Domain ohne https-Protokoll</FieldDescription>
        </TextField>
      </Field>
    </Section>
  );
};
