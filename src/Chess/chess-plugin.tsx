import { IntentResolverProvides, PluginDefinition, SurfaceProvides } from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { mkIntentBuilder } from "../lib";
import { ChessGame } from "./ChessGame";

// --- Chess Constants and Metadata -------------------------------------------
export const ChessPluginMeta = { id: "chess", name: "Chess plugin" };

// --- Chess Intents ----------------------------------------------------------
const actionPrefix = "@arena.dxos.org/chess";

export enum ChessIntent {}
export namespace ChessIntent {}
type ChessIntents = {};

export const chessIntent = mkIntentBuilder<ChessIntents>(ChessPluginMeta.id);

// --- Plugin Definition ------------------------------------------------------
type ChessPluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides;

export default function LayoutPlugin(): PluginDefinition<ChessPluginProvidesCapabilities> {
  return {
    meta: ChessPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: {
        resolver(intent, _plugins) {
          console.log(intent);

          switch (intent.action) {
          }
        },
      },
      surface: {
        component: ({ data, role }) => {
          if (role === "game") {
            return <ChessGame />;
          }

          return null;
        },
      },
    },
  };
}
