import { FC, ReactNode } from "react";
import { Scan, ScanProfile } from "../../api/types.js";
import { DefaultErrorView } from "./errorScans/defaultErrorView.js";
import { ErrorViewWithEditDomain } from "./errorScans/ErrorViewWithEditDomain.js";
import { SpecificErrorView } from "./errorScans/SpecificErrorView.js";

interface ErrorTexts {
  headline: string;
  description: ReactNode;
  showEditDomain: boolean;
}

const getErrorTexts = (
  error: string,
  profile: ScanProfile,
): ErrorTexts | undefined => {
  if (error.includes("ERR_NAME_NOT_RESOLVED")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Die Domain <strong>{profile.domain}</strong> ist nicht erreichbar.
          {" "}
        <br /> 
          Der Scan wurde abgebrochen, da die Website nicht gefunden werden konnte.
          Bitte überprüfe die eingegebene Adresse und versuche es erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_CERT_COMMON_NAME_INVALID")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Die Domain <strong>{profile.domain}</strong> ist nicht erreichbar.
          {" "}
        <br /> 
          Der Scan wurde abgebrochen, da das SSL-Zertifikat nicht zur aufgerufenen Adresse passt. 
          Bitte überprüfe die Adresse sowie das Zertifikat der Website und versuche es erneut.	
        </>
      ),
      showEditDomain: true,
    };
  }

  return undefined;
};

export const ErrorScan: FC<{ profile: ScanProfile; lastScan: Scan }> = ({
  lastScan,
  profile,
}) => {
  const errorInfos = lastScan.error
    ? getErrorTexts(lastScan.error, profile)
    : undefined;

  if (errorInfos?.showEditDomain) {
    return (
      <ErrorViewWithEditDomain
        profile={profile}
        scanId={lastScan._id}
        headline={errorInfos.headline}
        description={errorInfos.description}
      />
    );
  }
  if (errorInfos) {
    return (
      <SpecificErrorView
        profile={profile}
        scanId={lastScan._id}
        headline={errorInfos.headline}
        description={errorInfos.description}
      />
    );
  }

  return (
    <DefaultErrorView
      profile={profile}
      message={lastScan.error ?? ""}
      scanId={lastScan._id}
    />
  );
};
