import { Expando, useQuery } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React, { useCallback, useEffect } from "react";
import { useActiveRoom } from "../../SpaceManager/useActiveRoom";
import { Button } from "../../UI/Buttons";
import { useMutatingStore } from "../../hooks/useStore";
import { GameState, exec, zeroState } from "../game";
import { InnerChessGame } from "./InnerChessGame";

const DevControls = () => {
  const space = useActiveRoom();
  const dbGame = useQuery(space, { type: "chess" });

  const onDelete = useCallback(() => {
    if (!space) return;
    for (let game of dbGame) {
      space.db.remove(game);
    }
  }, [space, dbGame]);

  return (
    <div className="pl-4 font-mono">
      <p>Dev Controls</p>
      <div className="flex flex-row gap-1">
        <Button variant="danger" aria-label="Delete all games" onClick={onDelete}>
          Delete Games
        </Button>
      </div>
    </div>
  );
};

export const ChessGame = ({ id }: { id: string }) => {
  const space = useActiveRoom();
  const identity = useIdentity();

  let [dbGame] = useQuery(space, { type: "chess", gameId: id });
  const { send } = useMutatingStore(dbGame as any as GameState, exec);

  useEffect(() => {
    if (!space || !identity) return;

    if (!dbGame) {
      console.log("Creating game object");
      let expando = new Expando({ type: "chess", gameId: id, ...zeroState() });
      space.db.add(expando);
    } else {
      console.log("Loaded game object from db", dbGame);
      console.log(dbGame.toJSON());
      send({ type: "player-joined", player: identity?.identityKey.toHex() });
    }
  }, [space, identity, dbGame]);

  if (!dbGame) return null;

  return (
    <div>
      <InnerChessGame game={dbGame as any as GameState} send={send} />
      <DevControls />
    </div>
  );
};
