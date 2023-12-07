import {
  IntentResolverProvides,
  PluginDefinition,
  Surface,
  SurfaceProvides,
} from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { atom } from "signia";
import { mkIntentBuilder } from "../lib";
import { Layout } from "./Layout";

// --- Layout Constants and Metadata -------------------------------------------
export const LayoutPluginMeta = { id: "layout", name: "Layout Plugin" };

// --- Layout State ------------------------------------------------------------
type LayoutModes = "lobby" | "playing";

type LayoutState = { mode: LayoutModes };

export const layoutStateAtom = atom<LayoutState>("layout", { mode: "lobby" });

// --- Layout Intents ---------------------------------------------------------
const actionPrefix = "@arena.dxos.org/layout";

export enum LayoutIntent {
  PLAY_GAME = `${actionPrefix}/play-game`,
  RETURN_TO_LOBBY = `${actionPrefix}/return-to-lobby`,
}

export namespace LayoutIntent {
  export type PlayGame = { gameId: string };
  export type ReturnToLobby = { lobbyParam: string };
}

type LayoutIntents = {
  [LayoutIntent.PLAY_GAME]: LayoutIntent.PlayGame;
  [LayoutIntent.RETURN_TO_LOBBY]: LayoutIntent.ReturnToLobby;
};

export const layoutIntent = mkIntentBuilder<LayoutIntents>(LayoutPluginMeta.id);

// --- Plugin Definition ------------------------------------------------------
type LayoutPluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides;

export default function LayoutPlugin(): PluginDefinition<LayoutPluginProvidesCapabilities> {
  return {
    meta: LayoutPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>, // TODO(Zan): Add MOSAIC root?
      intent: {
        resolver(intent, _plugins) {
          console.log(intent);

          switch (intent.action) {
            case LayoutIntent.PLAY_GAME: {
              const { gameId } = intent.data as LayoutIntent.PlayGame;
              layoutStateAtom.update((s) => ({ ...s, mode: "playing" }));

              return true;
            }

            case LayoutIntent.RETURN_TO_LOBBY: {
              const { lobbyParam } = intent.data as LayoutIntent.ReturnToLobby;
              layoutStateAtom.update((s) => ({ ...s, mode: "lobby" }));

              return true;
            }
          }
        },
      },
      surface: {
        component: ({ role }) => {
          if (role === "main") {
            return <Layout />;
          }

          return null;
        },
      },
      root: () => {
        // Note: Here is where we can inject data into the rendered surface.
        return <Surface role="main" />;
      },
    },
  };
}
