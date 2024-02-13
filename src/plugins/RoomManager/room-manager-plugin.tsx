import { parseClientPlugin } from "@braneframe/plugin-client";
import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  SurfaceProvides,
  parseIntentPlugin,
  resolvePlugin,
} from "@dxos/app-framework";
import { Space } from "@dxos/react-client/echo";
import { Identity } from "@dxos/react-client/halo";
import { atom, computed } from "signia";
import { routes } from "../Layout/routes";
import { ToasterIntent, toasterIntent } from "../Toaster/toaster-plugin";
import { mkIntentBuilder } from "../../lib";
import { atomWithStorage } from "../../lib/atomWithStorage";
import { RoomManager } from "./components/RoomManager";

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
  UPDATE_ROOM_NAME = `${actionPrefix}/update-room-name`,
}

export namespace RoomManagerIntent {
  export type JoinRoom = { room: Room; noRedirect?: boolean };
  export type UpdateRoomName = { key: string; name: string };
}

type RoomManagerIntents = {
  [RoomManagerIntent.JOIN_ROOM]: RoomManagerIntent.JoinRoom;
  [RoomManagerIntent.UPDATE_ROOM_NAME]: RoomManagerIntent.UpdateRoomName;
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
    case RoomManagerIntent.UPDATE_ROOM_NAME: {
      const { key, name } = intent.data as RoomManagerIntent.UpdateRoomName;

      const room = allRoomsAtom.value.find((space) => space.key.equals(key));

      if (!room) {
        throw new Error(`[${RoomManagerPluginMeta.id}]: Room not found`);
      }

      room.properties.name = name;

      // TODO(Zan): This update is only for this client, I haven't figured out how
      // to broadcast this change to the other clients yet.
      availableRoomsAtom.update((rooms) =>
        rooms.map((room) => (room.key === key ? { ...room, name } : room))
      );

      dispatch(
        toasterIntent(ToasterIntent.ISSUE_TOAST, {
          title: "Updated room name",
          description: name,
        })
      );

      window.history.pushState({}, "", routes.root);

      break;
    }
  }
};

// --- Plugin Definition ------------------------------------------------------
export type RoomManagerProvides = IntentResolverProvides &
  SurfaceProvides & {
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
      surface: {
        component: ({ role }) => {
          if (role === "room-manager") {
            return <RoomManager />;
          }

          return null;
        },
      },
    },
  };
}
