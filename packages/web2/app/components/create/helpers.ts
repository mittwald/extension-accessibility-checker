export function extractDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
}

export function extractPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname;
  } catch (error) {
    return url;
  }
}

export function prependPathWithSlash(path: string): string {
  if (path.startsWith("/")) {
    return path;
  }
  return `/${path}`;
}
