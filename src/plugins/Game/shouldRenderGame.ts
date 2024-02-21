type DataWithInstanceId = { instanceId: string };

export const shouldRenderGame = (
  data: any,
  role: string | undefined,
  gameId: string
): data is DataWithInstanceId =>
  role === "game" && data?.gameId === gameId && typeof data?.instanceId === "string";
