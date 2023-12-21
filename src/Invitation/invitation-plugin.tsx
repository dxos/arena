import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  SurfaceProvides,
  resolvePlugin,
} from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { atom } from "signia";
import { GameProvides } from "../GameProvides";
import { parseRoomManagerPlugin } from "../RoomManager/room-manager-plugin";
import { mkIntentBuilder } from "../lib";
import { CreateInvitation } from "./CreateInvitation";
import { InvitationView } from "./Invitation";
import { Expando } from "@dxos/react-client/echo";
import { v4 as uuid } from "uuid";

// --- Constants and Metadata -------------------------------------------------
export const InvitationPluginMeta = { id: "Invitation", name: "Invitation plugin" };

// --- State ------------------------------------------------------------------
export const gameProvidesAtom = atom<GameProvides["game"][]>("game-provides", []);

// TODO(Zan): Add game type / variant here
export type GameDescription = {
  gameId: string;
  variantId: string;
  timeControl: unknown;
  playerOrdering: "creator-first" | "creator-second" | "random";
};

export type Invitation = {
  invitationId: string;
  creatorId: string;
  joiningPlayerId?: string;
  finalised: boolean;
  cancelled: boolean;
  newEntityId: string;

  gameDescription: GameDescription;
};

export const invitationIdAtom = atom<Invitation | undefined>("invitation-id", undefined);

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/Invitation";

export enum InvitationIntent {
  CREATE_INVITATION = `${actionPrefix}/invite`,
}

export namespace InvitationIntent {
  export type CreateInvitation = { creatorId: string; gameDescription: GameDescription };
}

type InvitationIntents = {
  [InvitationIntent.CREATE_INVITATION]: InvitationIntent.CreateInvitation;
};

export const invitationIntent = mkIntentBuilder<InvitationIntents>(InvitationPluginMeta.id);

const intentResolver = (intent: Intent, plugins: Plugin[]) => {
  console.log("Invitation resolver", intent);
  const roomManagerPlugin = resolvePlugin(plugins, parseRoomManagerPlugin);

  if (!roomManagerPlugin) {
    throw new Error(`[${InvitationPluginMeta.id}]: Room manager not found`);
  }

  const space = roomManagerPlugin.provides.getActiveRoom();

  switch (intent.action) {
    case InvitationIntent.CREATE_INVITATION: {
      const data = intent.data as InvitationIntent.CreateInvitation;

      const invitation: Invitation = {
        invitationId: uuid(),
        creatorId: data.creatorId,
        joiningPlayerId: undefined,
        finalised: false,
        cancelled: false,
        newEntityId: uuid(),

        gameDescription: data.gameDescription,
      };

      space.db.add(new Expando({ type: "invitation", ...invitation }));
      window.history.pushState({}, "", `/play-with-me/${invitation.invitationId}`);

      break;
    }
  }
};

// --- Plugin Definition ------------------------------------------------------
type InvitationPluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides;

export default function InvitationPlugin(): PluginDefinition<InvitationPluginProvidesCapabilities> {
  return {
    meta: InvitationPluginMeta,
    ready: async (plugins: Plugin[]) => {
      // Collect all game provides
      const gameProvides = plugins
        .map((plugin) => plugin.provides as any)
        .filter((p): p is GameProvides => GameProvides.Schema.safeParse(p).success)
        .map((p) => p.game);

      gameProvidesAtom.set(gameProvides);
    },
    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: { resolver: intentResolver },
      surface: {
        component: ({ data, role }) => {
          if (role === "create-invitation") {
            return <CreateInvitation />;
          }

          if (role === "invitation" && typeof data.id === "string") {
            return <InvitationView id={data.id} />;
          }

          return null;
        },
      },
    },
  };
}
