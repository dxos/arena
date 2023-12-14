import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  SurfaceProvides,
  useIntent,
} from "@dxos/app-framework";
import { PublicKey } from "@dxos/react-client";
import { Expando, useQuery, useSpace } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React, { PropsWithChildren, useEffect } from "react";
import { atom } from "signia";
import { mkIntentBuilder } from "../lib";

// --- Constants and Metadata -------------------------------------------------
export const InvitationPluginMeta = { id: "Invitation", name: "Invitation plugin" };

// --- State ------------------------------------------------------------------

// TODO(Zan): Add game type / variant here
type Invitation = {
  invitationId: string;
  creatorId: string;
  joiningPlayerId?: PublicKey;
  finalised: boolean;
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

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: { resolver: intentResolver },
      surface: {
        component: ({ data, role }) => {
          console.log("Invitation Surface", data, role);
          if (role === "invitation" && typeof data.id === "string") {
            return <Invitation id={data.id} />;
          }

          return null;
        },
      },
    },
  };
}

const Invitation = ({ id }: { id: string }) => {
  const { dispatch } = useIntent();

  const space = useSpace();
  const [invitation] = useQuery(space, { type: "invitation", invitationId: id });
  const identity = useIdentity();

  useEffect(() => {
    if (!identity || !space) return;
    if (!invitation) {
      const newInvitation: Invitation = {
        invitationId: id,
        creatorId: identity.identityKey.toHex(),
        finalised: false,
      };

      space.db.add(new Expando({ type: "invitation", ...newInvitation }));
    } else {
      console.log("We are", identity.identityKey.toHex());
      console.log("Creator is", invitation.creatorId);
      console.log("Equal?", invitation.creatorId === identity.identityKey.toHex());

      if (invitation.creatorId !== identity.identityKey.toHex()) {
        console.log("We are the second player");
      }
    }
  }, [invitation, identity, space]);

  return <div>Invitation! {id}</div>;
};
