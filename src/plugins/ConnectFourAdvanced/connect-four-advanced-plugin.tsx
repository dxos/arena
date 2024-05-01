import { PluginDefinition, SurfaceProvides } from "@dxos/app-framework";
import { create } from "@dxos/react-client/echo";
import { match } from "ts-pattern";
import { GameProvides } from "../Game/GameProvides";
import { shouldRenderGame } from "../Game/shouldRenderGame";
import { ConnectFourAdvanced } from "./components/ConnectFourAdvanced";
import { zeroState } from "./core/game";

// --- C16d Constants and Metadata -------------------------------------------
export const ConnectFourAdvancedPluginMeta = { id: "c16d", name: "Connect Four Advanced Plugin" };

// --- Plugin Definition ------------------------------------------------------
type C16dPluginProvidesCapabilities = SurfaceProvides & GameProvides;

export default function ConnectFourAdvancedPlugin(): PluginDefinition<C16dPluginProvidesCapabilities> {
  return {
    meta: ConnectFourAdvancedPluginMeta,

    provides: {
      surface: {
        component: ({ data, role }) => {
          if (shouldRenderGame(data, role, ConnectFourAdvancedPluginMeta.id)) {
            return <ConnectFourAdvanced id={data.instanceId} />;
          }

          return null;
        },
      },
      game: {
        id: ConnectFourAdvancedPluginMeta.id,
        displayName: "Connect4 Advanced",
        variations: [{ displayName: "Standard", id: "standard" }],
        timeControlOptions: undefined,

        createGame(room, id, variation, _timeControl, players, ordering) {
          let game = zeroState();

          const c16dPlayers = match(ordering)
            .with("creator-first", () => ({
              red: players.creatorId,
              yellow: players.challengerId,
            }))
            .with("challenger-first", () => ({
              red: players.challengerId,
              yellow: players.creatorId,
            }))
            .with("random", () => {
              const random = Math.random() > 0.5;
              return {
                red: random ? players.creatorId : players.challengerId,
                yellow: random ? players.challengerId : players.creatorId,
              };
            })
            .exhaustive();

          game.players = c16dPlayers;

          room.db.add(create({ type: "game-c16d", gameId: id, ...game }));
        },
      },
    },
  };
}
