import { FC } from "react";
import { Scan, ScanProfile } from "../../api/types.js";
import { DnsErrorView } from "./errorScans/dnsErrorView.js";
import { CertificateErrorView } from "./errorScans/certificateErrorView.js";
import { DefaultErrorView } from "./errorScans/defaultErrorView.js";

export const ErrorScan: FC<{
  profile: ScanProfile;
  lastScan: Scan;
}> = ({ lastScan, profile }) => {
  if (lastScan.error?.startsWith("net::ERR_NAME_NOT_RESOLVED")) {
    return <DnsErrorView profile={profile} scanId={lastScan._id} />;
  }
  if (lastScan.error?.startsWith("net::ERR_CERT_")) {
    return <CertificateErrorView profile={profile} scanId={lastScan._id} />;
  }

  return (
    <DefaultErrorView
      profile={profile}
      message={lastScan.error!}
      scanId={lastScan._id}
    />
  );
};
