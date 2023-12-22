import { Expando, useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React, { useCallback, useEffect } from "react";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { Button } from "../../UI/Buttons";
import { useMutatingStore } from "../../hooks/useStore";
import { GameState, exec, zeroState } from "../game";
import { InnerChessGame } from "./InnerChessGame";

export const ChessGame = ({ id }: { id: string }) => {
  const space = useActiveRoom();
  const identity = useIdentity();

  let [dbGame] = useQuery(space, { type: "game", gameId: id });
  const { send } = useMutatingStore(dbGame as any as GameState, exec);

  if (!dbGame) return null;

  return <InnerChessGame game={dbGame as any as GameState} send={send} />;
};
