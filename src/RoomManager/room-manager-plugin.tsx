import { parseClientPlugin } from "@braneframe/plugin-client";
import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  resolvePlugin,
} from "@dxos/app-framework";
import { PublicKey } from "@dxos/react-client";
import { Space } from "@dxos/react-client/echo";
import { Identity } from "@dxos/react-client/halo";
import { atom, computed } from "signia";
import { mkIntentBuilder } from "../lib";
import { atomWithStorage } from "../lib/atomWithStorage";

// TODO(Zan): Expose settings to disable sound effects
// TODO(Zan): Atlas should be composed of sounds sourced from different plugins

// --- Constants and Metadata -------------------------------------------------
export const RoomManagerPluginMeta = { id: "room-manager", name: "Room manager" };

// --- State ------------------------------------------------------------------
export const activeRoomKeyAtom = atomWithStorage<PublicKey | undefined>("activeRoom", undefined);
export const availableRoomKeysAtom = atom<PublicKey[]>("availableRooms", []);

const allRoomsAtom = atom<Space[]>("allRooms", []);

const activeRoomAtom = computed("computedActiveSpace", () => {
  const spaces = allRoomsAtom.value;
  const activeRoom = activeRoomKeyAtom.value;

  if (!activeRoom) {
    return spaces[0];
  }

  return allRoomsAtom.value.find((space) => space.key.equals(activeRoom)) as Space;
});

export const usersAtom = atom<Identity[]>("users", []);

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/room-manager";

export enum RoomManagerIntent {
  JOIN_ROOM = `${actionPrefix}/join-room`,
}

export namespace RoomManagerIntent {
  export type JoinRoom = { spaceKey: PublicKey };
}

type RoomManagerIntents = {
  [RoomManagerIntent.JOIN_ROOM]: RoomManagerIntent.JoinRoom;
};

export const roomManagerIntent = mkIntentBuilder<RoomManagerIntents>(RoomManagerPluginMeta.id);

const intentResolver = (intent: Intent, _plugins: Plugin[]) => {
  switch (intent.action) {
    case RoomManagerIntent.JOIN_ROOM: {
      const { spaceKey } = intent.data as RoomManagerIntent.JoinRoom;
      console.log("Joining room", spaceKey.toHex());

      activeRoomKeyAtom.set(spaceKey);
      break;
    }
  }
};

// --- Plugin Definition ------------------------------------------------------
export type RoomManagerProvides = IntentResolverProvides & {
  getActiveRoom: () => Space;
};

export const parseRoomManagerPlugin = (plugin: Plugin) => {
  if (typeof (plugin.provides as any)?.getActiveRoom === "function") {
    return plugin as Plugin<RoomManagerProvides>;
  }
};

type Cancellable = { unsubscribe: () => void };

export default function RoomManagerPlugin(): PluginDefinition<RoomManagerProvides> {
  const subscriptions = new Set<Cancellable>();

  return {
    meta: RoomManagerPluginMeta,

    ready: async (plugins) => {
      const clientPlugin = resolvePlugin(plugins, parseClientPlugin);

      if (!clientPlugin) {
        return;
      }

      const client = clientPlugin.provides.client;

      subscriptions.add(
        (client.spaces as any).subscribe((spaces: Space[]) => {
          allRoomsAtom.set(spaces);
          availableRoomKeysAtom.set(spaces.map((space) => space.key));

          // Collect all users
          // TODO(Zan): This probably won't be reactive when a user joins a room
          const users = spaces.flatMap((space) => space.members.get());
          usersAtom.set(users.map((u) => u.identity));
        })
      );
    },
    unload: async () => subscriptions.forEach((subscription) => subscription.unsubscribe()),
    provides: {
      intent: { resolver: intentResolver },
      getActiveRoom: () => activeRoomAtom.value,
    },
  };
}
