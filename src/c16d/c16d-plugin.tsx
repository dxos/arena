import { IntentResolverProvides, PluginDefinition, SurfaceProvides } from "@dxos/app-framework";
import { Expando } from "@dxos/react-client/echo";
import { PropsWithChildren } from "react";
import { match } from "ts-pattern";
import { GameProvides } from "../GameProvides";
import { mkIntentBuilder } from "../lib";
import { C16D } from "./components/C16D";
import { zeroState } from "./game";

// --- C16d Constants and Metadata -------------------------------------------
export const C16dPluginMeta = { id: "c16d", name: "C16d plugin" };

// --- C16d Intents ----------------------------------------------------------
const actionPrefix = "@arena.dxos.org/c16d";

export enum C16dIntent {}
export namespace C16dIntent {}
type C16dIntents = {};

export const c16dIntent = mkIntentBuilder<C16dIntents>(C16dPluginMeta.id);

// --- Plugin Definition ------------------------------------------------------
type C16dPluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides & GameProvides;

export default function C16dPlugin(): PluginDefinition<C16dPluginProvidesCapabilities> {
  return {
    meta: C16dPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: { resolver: (intent, _plugins) => console.log(intent) },
      surface: {
        component: ({ data, role }) => {
          if (
            role === "game" &&
            data?.gameId === C16dPluginMeta.id &&
            typeof data?.instanceId === "string"
          ) {
            return <C16D id={data.instanceId} />;
          }

          return null;
        },
      },
      game: {
        id: C16dPluginMeta.id,
        displayName: "Connect4 Advanced",
        variations: [{ displayName: "Standard", id: "standard" }],
        timeControlOptions: undefined,

        createGame(room, id, variation, timeControl, players, ordering) {
          // TODO(Zan): Initialise the game properly
          // TODO(Zan): Apply variation, time control

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

          room.db.add(new Expando({ type: "game-c16d", gameId: id, ...game }));
        },
      },
    },
  };
}
