import type { FC } from "react";
import { getCronText } from "./lib";

interface Props {
  cronSyntax: string;
}

export const CronText: FC<Props> = (props) => {
  const { cronSyntax } = props;

  return getCronText(cronSyntax);
};
