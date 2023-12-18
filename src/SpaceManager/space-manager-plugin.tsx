import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  resolvePlugin,
} from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { mkIntentBuilder } from "../lib";
import { PublicKey } from "@dxos/react-client";
import { atom } from "signia";
import { parseClientPlugin } from "@braneframe/plugin-client";
import { Space } from "@dxos/react-client/echo";
import { atomWithStorage } from "../lib/atomWithStorage";

// TODO(Zan): Expose settings to disable sound effects
// TODO(Zan): Atlas should be composed of sounds sourced from different plugins

// --- Constants and Metadata -------------------------------------------------
export const SpaceManagerPluginMeta = { id: "space-manager", name: "Space manager" };

// --- State ------------------------------------------------------------------
export const currentSpaceAtom = atomWithStorage<PublicKey | undefined>("currentSpace", undefined);
export const availableSpacesAtom = atom<PublicKey[]>("availableSpaces", []);

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/space-manager";

export enum SpaceManagerIntent {
  JOIN_SPACE = `${actionPrefix}/join-space`,
}

export namespace SpaceManagerIntent {
  export type JoinSpace = { spaceKey: PublicKey };
}

type SpaceManagerIntents = {
  [SpaceManagerIntent.JOIN_SPACE]: SpaceManagerIntent.JoinSpace;
};

export const spaceManagerIntent = mkIntentBuilder<SpaceManagerIntents>(SpaceManagerPluginMeta.id);

const intentResolver = (intent: Intent, _plugins: Plugin[]) => {
  switch (intent.action) {
    case SpaceManagerIntent.JOIN_SPACE: {
      const { spaceKey } = intent.data as SpaceManagerIntent.JoinSpace;
      console.log("Joining space", spaceKey.toHex());

      currentSpaceAtom.set(spaceKey);
      break;
    }
  }
};

// --- Plugin Definition ------------------------------------------------------
type SpaceManagerPluginProvidesCapabilities = IntentResolverProvides;

type Cancellable = { unsubscribe: () => void };

export default function SpaceManagerPlugin(): PluginDefinition<SpaceManagerPluginProvidesCapabilities> {
  const subscriptions = new Set<Cancellable>();

  return {
    meta: SpaceManagerPluginMeta,

    ready: async (plugins) => {
      const clientPlugin = resolvePlugin(plugins, parseClientPlugin);

      if (!clientPlugin) {
        return;
      }

      const client = clientPlugin.provides.client;

      subscriptions.add(
        (client.spaces as any).subscribe((spaces: Space[]) => {
          availableSpacesAtom.set(spaces.map((space) => space.key));
        })
      );
    },
    unload: async () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    },

    provides: { intent: { resolver: intentResolver } },
  };
}
