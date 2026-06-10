export function parseLoginSearch(search: Record<string, unknown>) {
  return {
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    // Absolute URL to return to after login, validated against an allowlist in
    // `redirectAfterLogin` (used by the landing's pricing checkout to bounce the
    // user back to `/pricing` and auto-resume). Kept in search so the router
    // doesn't drop it before login completes.
    returnTo: typeof search.returnTo === 'string' ? search.returnTo : undefined,
    source: typeof search.source === 'string' ? search.source : undefined,
    extensionId:
      typeof search.extensionId === 'string' ? search.extensionId : undefined,
  }
}
