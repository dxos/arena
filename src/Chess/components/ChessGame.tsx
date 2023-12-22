import { useQuery } from "@dxos/react-client/echo";
import React from "react";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { useMutatingStore } from "../../hooks/useStore";
import { GameState, exec } from "../game";
import { InnerChessGame } from "./InnerChessGame";

export const ChessGame = ({ id }: { id: string }) => {
  const space = useActiveRoom();

  let [dbGame] = useQuery(space, { type: "game", gameId: id });
  const { send } = useMutatingStore(dbGame as any as GameState, exec);

  if (!dbGame) return null;

  return <InnerChessGame game={dbGame as any as GameState} send={send} />;
};
