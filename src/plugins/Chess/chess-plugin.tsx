import { PluginDefinition, SurfaceProvides } from "@dxos/app-framework";
import { Expando } from "@dxos/react-client/echo";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { GameProvides } from "../Game/GameProvides";
import { ChessGame } from "./components/ChessGame";
import { zeroState } from "./core/game";
import { shouldRenderGame } from "../Game/shouldRenderGame";

// --- Chess Constants and Metadata -------------------------------------------
export const ChessPluginMeta = { id: "chess", name: "Chess plugin" };

// --- Plugin Definition ------------------------------------------------------
type ChessPluginProvidesCapabilities = SurfaceProvides & GameProvides;

export default function ChessPlugin(): PluginDefinition<ChessPluginProvidesCapabilities> {
  return {
    meta: ChessPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      surface: {
        component: ({ data, role }) => {
          if (shouldRenderGame(data, role, ChessPluginMeta.id)) {
            return <ChessGame id={data.instanceId} />;
          }

          return null;
        },
      },
      game: {
        id: ChessPluginMeta.id,
        displayName: "Chess",
        variations: [{ displayName: "Standard", id: "standard" }],
        timeControlOptions: undefined,

        createGame(room, id, variation, timeControl, players, ordering) {
          const game = zeroState();
          // TODO(Zan): Apply variation, time control

          const chessPlayers = match(ordering)
            .with("creator-first", () => ({
              white: players.creatorId,
              black: players.challengerId,
            }))
            .with("challenger-first", () => ({
              white: players.challengerId,
              black: players.creatorId,
            }))
            .with("random", () => {
              const random = Math.random() > 0.5;
              return {
                white: random ? players.creatorId : players.challengerId,
                black: random ? players.challengerId : players.creatorId,
              };
            })
            .exhaustive();

          game.players = chessPlayers;

          room.db.add(new Expando({ type: "game", gameId: id, ...game }));
        },
      },
    },
  };
}
