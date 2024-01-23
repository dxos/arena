// --- App Routing -------------------------------------------------------------
export const appPaths = [
  ["lobby", "/"],
  ["create-invitation", "/create-invitation"],
  ["invitation", "/play-with-me/:id"],
  ["game", "/game/:gameId/:id"],
  ["choose-room", "/choose-room"],
] as const;

export const routes = {
  root: "/",
  game: (gameId: string, instanceId: string) => `/game/${gameId}/${instanceId}`,
  invitation: (id: string, isOpen = false) => `/play-with-me/${id}${isOpen ? "?isOpen=true" : ""}`,
};
