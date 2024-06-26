import { PluginDefinition, SurfaceProvides } from "@dxos/app-framework";
import { create } from "@dxos/react-client/echo";
import { match } from "ts-pattern";
import { GameProvides } from "../Game/GameProvides";
import { shouldRenderGame } from "../Game/shouldRenderGame";
import { ChessGame } from "./components/ChessGame";
import { zeroState } from "./core/game";

// --- Chess Constants and Metadata -------------------------------------------
export const ChessPluginMeta = { id: "chess", name: "Chess plugin" };

// --- Plugin Definition ------------------------------------------------------
type ChessPluginProvidesCapabilities = SurfaceProvides & GameProvides;

export default function ChessPlugin(): PluginDefinition<ChessPluginProvidesCapabilities> {
  return {
    meta: ChessPluginMeta,

    provides: {
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

          room.db.add(create({ type: "game", gameId: id, ...game }));
        },
      },
    },
  };
}
