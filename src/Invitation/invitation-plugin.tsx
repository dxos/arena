import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  SurfaceProvides,
} from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { atom } from "signia";
import { mkIntentBuilder } from "../lib";
import { InvitationView } from "./Invitation";
import { GameProvides } from "../GameProvides";

// --- Constants and Metadata -------------------------------------------------
export const InvitationPluginMeta = { id: "Invitation", name: "Invitation plugin" };

// --- State ------------------------------------------------------------------

// TODO(Zan): Add game type / variant here
export type Invitation = {
  invitationId: string;
  creatorId: string;
  joiningPlayerId?: string;
  finalised: boolean;
  cancelled: boolean;
  newEntityId: string;
};

export const invitationIdAtom = atom<Invitation | undefined>("invitation-id", undefined);

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/Invitation";

export enum InvitationIntent {
  INITIALISE = `${actionPrefix}/invite`,
}

export namespace InvitationIntent {
  export type Initialise = Invitation; // TODO(Zan): Add game type / variant here
}

type InvitationIntents = {
  [InvitationIntent.INITIALISE]: InvitationIntent.Initialise;
};

export const invitationIntent = mkIntentBuilder<InvitationIntents>(InvitationPluginMeta.id);

const intentResolver = (intent: Intent, plugins: Plugin[]) => {
  switch (intent.action) {
    case InvitationIntent.INITIALISE: {
      const data = intent.data as InvitationIntent.Initialise;

      // invitationIdAtom.set({ id: data.id, creatorId: "123", finalised: false });
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
      console.log("Invitation Plugin Ready", plugins);

      // Collect all provides
      const gameProvides: GameProvides[] = plugins
        .map((plugin) => plugin.provides as any)
        .filter((p): p is GameProvides => GameProvides.Schema.safeParse(p).success);

      console.log("Game provides", gameProvides);
    },

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: { resolver: intentResolver },
      surface: {
        component: ({ data, role }) => {
          console.log("Invitation Surface", data, role);
          if (role === "invitation" && typeof data.id === "string") {
            return <InvitationView id={data.id} />;
          }

          return null;
        },
      },
    },
  };
}
