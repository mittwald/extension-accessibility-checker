// `@mittwald/ext-bridge/node` handles the extension secret and must never run
// in the browser, so the package deliberately declares its `./node` subpath
// with a `node` export condition and no fallback. Vite's client environment
// resolves without that condition and therefore throws instead of skipping the
// specifier -- in the dependency scanner, in the dev style collector, and in
// the module graph alike.
//
// The specifier reaches the client graph because `app/actions/middleware.ts`
// pairs a `.client()` handler with a `.server()` handler, and the Start
// compiler strips server bodies but leaves their top-level imports in place
// during dev. This stub is substituted for the client environment only, so the
// real implementation never gets near a browser bundle and any accidental call
// fails loudly instead of silently.

const serverOnly = (name: string) => () => {
  throw new Error(
    `@mittwald/ext-bridge/node#${name} is server-only and must not be called in the browser`,
  );
};

export const getAccessToken = serverOnly("getAccessToken");
export const verify = serverOnly("verify");
