export function parseLoginSearch(search: Record<string, unknown>) {
  return {
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    source: typeof search.source === 'string' ? search.source : undefined,
    extensionId:
      typeof search.extensionId === 'string' ? search.extensionId : undefined,
  }
}
