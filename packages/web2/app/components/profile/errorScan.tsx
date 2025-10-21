import { FC, ReactNode } from "react";
import { Scan, ScanProfile } from "../../api/types.js";
import { DefaultErrorView } from "./errorScans/defaultErrorView.js";
import { ErrorViewWithEditDomain } from "./errorScans/ErrorViewWithEditDomain.js";
import { ErrorViewWithoutEditDomain } from "./errorScans/ErrorViewWithoutEditDomain.js";

interface ErrorTexts {
  headline: string;
  description: ReactNode;
  showEditDomain: boolean;
}

const getErrorTexts = (error: string): ErrorTexts | undefined => {
  if (error.includes("ERR_NAME_NOT_RESOLVED")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da die Website nicht gefunden werden
          konnte. Bitte überprüfe die eingegebene Adresse und versuche es
          erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_CERT_COMMON_NAME_INVALID")) {
    return {
      headline: "SSL-Zertifikat passt nicht zur URL",
      description: (
        <>
          Der Scan wurde abgebrochen, da das SSL-Zertifikat nicht zur
          aufgerufenen Adresse passt. Bitte überprüfe die Adresse sowie das
          Zertifikat der Website und versuche es erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_CONNECTION_REFUSED")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da die Verbindung zur Website vom Server
          abgelehnt wurde. Bitte überprüfe die Adresse und starte den Scan
          erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_TOO_MANY_REDIRECTS")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da die Website zu viele Weiterleitungen
          enthält. Bitte überprüfe die Adresse und starte den Scan erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_TIMED_OUT")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da beim Verbindungsaufbau keine Antwort
          von der Website eingegangen ist. Bitte überprüfe die Adresse und
          starte den Scan erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_INVALID_AUTH_CREDENTIALS")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da die Website durch einen Passwortschutz
          oder eine Zugangsbeschränkung gesichert ist. Bitte nutze eine
          öffentlich erreichbare Adresse oder entferne die Zugriffsbeschränkung
          und starte den Scan erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("ERR_CERT_AUTHORITY_INVALID")) {
    return {
      headline: "SSL-Zertifikat abgelaufen",
      description: (
        <>
          Der Scan wurde abgebrochen, da die Zertifizierungsstelle (CA) des
          SSL-Zertifikates nicht vertrauenswürdig oder das Zertifikat abgelaufen
          ist. Bitte überprüfe das Zertifikat und starte den Scan erneut.
        </>
      ),
      showEditDomain: false,
    };
  }

  if (error.includes("ERR_BLOCKED_BY_CLIENT")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da eine Ressource der Website blockiert
          wurde – zum Beispiel durch einen Werbe-, Tracking- oder Script-Blocker
          im Browser. Bitte überprüfe die Ursache und versuche es anschließend
          erneut.
        </>
      ),
      showEditDomain: false,
    };
  }

  if (error.includes("ERR_SSL_PROTOCOL_ERROR")) {
    return {
      headline: "Sichere Verbindung fehlgeschlagen",
      description: (
        <>
          Der Scan wurde abgebrochen, da keine sichere Verbindung zur Website
          hergestellt werden konnte. Bitte überprüfe das SSL-Zertifikat sowie
          die Servereinstellungen und starte den Scan erneut.
        </>
      ),
      showEditDomain: false,
    };
  }

  if (error.includes("ERR_CERT_DATE_INVALID")) {
    return {
      headline: "SSL-Zertifikat ungültig",
      description: (
        <>
          Der Scan wurde abgebrochen, da das SSL-Zertifikat der Website
          abgelaufen oder ungültig ist. Bitte überprüfe das Zertifikat und
          versuche es erneut.
        </>
      ),
      showEditDomain: false,
    };
  }

  if (error.includes("ERR_SSL_UNRECOGNIZED_NAME_ALERT")) {
    return {
      headline: "SSL-Zertifikat ungültig",
      description: (
        <>
          Der Scan wurde abgebrochen, da das SSL-Zertifikat der Website nicht
          erkannt oder validiert werden konnte. Bitte überprüfe das Zertifikat
          und starte den Scan erneut.
        </>
      ),
      showEditDomain: false,
    };
  }

  if (error.includes("Navigation timeout")) {
    return {
      headline: "Domain nicht erreichbar",
      description: (
        <>
          Der Scan wurde abgebrochen, da die Website nicht innerhalb der
          vorgesehenen Ladezeit reagiert hat. Bitte überprüfe die Adresse und
          starte den Scan erneut.
        </>
      ),
      showEditDomain: true,
    };
  }

  if (error.includes("exited with code 1")) {
    return {
      headline: "Scan fehlgeschlagen",
      description: (
        <>
          Der Scan wurde abgebrochen, da der Prozess unerwartet beendet wurde.
          Bitte überprüfe die eingegebene Adresse und starte den Scan erneut.
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
  const errorInfos = lastScan.error ? getErrorTexts(lastScan.error) : undefined;

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
      <ErrorViewWithoutEditDomain
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
