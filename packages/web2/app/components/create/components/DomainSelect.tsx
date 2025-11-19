import * as React from "react";
import {
  Alert,
  ComboBox,
  Heading,
  Label,
  Option,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useServerFn } from "@tanstack/react-start";
import { getDomains as getDomainsServerFn } from "../../../actions/domain.js";
import { useQuery } from "@tanstack/react-query";
import { Field } from "@mittwald/flow-remote-react-components/react-hook-form";

interface Props {
  domainId?: string;
}

export const DomainSelect: React.FC<Props> = () => {
  const getDomains = useServerFn(getDomainsServerFn);
  const { isError: hasError, isLoading, data: domains} = useQuery({
    queryKey: ["domains"],
    queryFn: () => getDomains(),
    throwOnError: false,
    retry: 1,
  });

  if (isLoading) {
    return (
      <ComboBox isDisabled placeholder="Laden ..." isRequired>
        <Label>Domain</Label>
      </ComboBox>
    );
  }

  if (hasError) {
    return (
      <Alert status="danger">
        <Heading>Fehler beim Laden der Domains</Heading>
        <Text>
          Es ist ein Fehler beim Laden der Domains aufgetreten. Bitte versuche
          es später erneut.
        </Text>
      </Alert>
    );
  }

  return (
    <Field
      name="domain"
      rules={{
        required: "Die Domain ist erforderlich.",
      }}
    >
      <ComboBox>
        <Label>Domain</Label>
        {domains?.map((domain) => (
          <Option
            key={domain.id}
            value={domain.hostname}
            textValue={domain.hostname}
          >
            {domain.hostname}
          </Option>
        ))}
      </ComboBox>
    </Field>
  );
};
