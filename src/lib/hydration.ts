export const emptySubscribe = () => () => {};

export function getClientHydratedSnapshot() {
  return true;
}

export function getServerHydratedSnapshot() {
  return false;
}

export function canRenderThemeToggle(hydrated: boolean, resolvedTheme?: string) {
  return hydrated && resolvedTheme !== undefined;
}
