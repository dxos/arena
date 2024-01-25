import { parseClientPlugin } from "@braneframe/plugin-client";
import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  parseIntentPlugin,
  resolvePlugin,
} from "@dxos/app-framework";
import { Space } from "@dxos/react-client/echo";
import { Identity } from "@dxos/react-client/halo";
import { atom, computed } from "signia";
import { mkIntentBuilder } from "../lib";
import { atomWithStorage } from "../lib/atomWithStorage";
import { routes } from "../Layout/routes";
import { ToasterIntent, toasterIntent } from "../Toaster/toaster-plugin";

// TODO(Zan): Expose settings to disable sound effects
// TODO(Zan): Atlas should be composed of sounds sourced from different plugins

export type Room = { key: string; name?: string };

// --- Constants and Metadata -------------------------------------------------
export const RoomManagerPluginMeta = { id: "room-manager", name: "Room manager" };

// --- State ------------------------------------------------------------------
export const activeRoomKeyAtom = atomWithStorage<string | undefined>("activeRoom", undefined);
export const availableRoomsAtom = atom<Room[]>("availableRooms", []);

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
export const usernamesAtom = computed("usernames", () =>
  Object.fromEntries(
    usersAtom.value.map((u) => [u.identityKey.toHex(), u.profile?.displayName || "Anonymous"])
  )
);

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/room-manager";

export enum RoomManagerIntent {
  JOIN_ROOM = `${actionPrefix}/join-room`,
}

export namespace RoomManagerIntent {
  export type JoinRoom = { room: Room; noRedirect?: boolean };
}

type RoomManagerIntents = {
  [RoomManagerIntent.JOIN_ROOM]: RoomManagerIntent.JoinRoom;
};

export const roomManagerIntent = mkIntentBuilder<RoomManagerIntents>(RoomManagerPluginMeta.id);

const intentResolver = (intent: Intent, plugins: Plugin[]) => {
  const intentPlugin = resolvePlugin(plugins, parseIntentPlugin);

  if (!intentPlugin) {
    throw new Error(`[${RoomManagerPluginMeta.id}]: Intent plugin not found`);
  }

  const dispatch = intentPlugin.provides.intent.dispatch;

  switch (intent.action) {
    case RoomManagerIntent.JOIN_ROOM: {
      const {
        room: { key, name },
        noRedirect,
      } = intent.data as RoomManagerIntent.JoinRoom;

      activeRoomKeyAtom.set(key);

      if (noRedirect !== true) {
        window.history.pushState({}, "", routes.root);
      }

      dispatch(
        toasterIntent(ToasterIntent.ISSUE_TOAST, {
          title: "Joined room",
          description: name || `${key.substring(0, 24)}...`,
        })
      );

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
          availableRoomsAtom.set(
            spaces.map((space) => ({ key: space.key.toHex(), name: space.properties?.name }))
          );

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
