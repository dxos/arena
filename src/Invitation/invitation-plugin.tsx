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
import { Expando } from "@dxos/react-client/echo";
import { PropsWithChildren } from "react";
import { atom } from "signia";
import { match } from "ts-pattern";
import { v4 as uuid } from "uuid";
import { GameProvides, PlayerOrdering } from "../GameProvides";
import { parseRoomManagerPlugin } from "../RoomManager/room-manager-plugin";
import { mkIntentBuilder } from "../lib";
import { CreateInvitation } from "./CreateInvitation";
import { InvitationView } from "./Invitation";

// --- Constants and Metadata -------------------------------------------------
export const InvitationPluginMeta = { id: "Invitation", name: "Invitation plugin" };

// --- State ------------------------------------------------------------------
export const gameProvidesAtom = atom<GameProvides["game"][]>("game-provides", []);

// TODO(Zan): Add game type / variant here
export type GameDescription = {
  gameId: string;
  variantId: string;
  timeControl: unknown;
  playerOrdering: PlayerOrdering;
};

export type Invitation = {
  invitationId: string;
  creatorId: string;
  joiningPlayerId?: string;
  finalised: boolean;
  cancelled: boolean;
  isOpenGame: boolean;

  gameDescription: GameDescription;
  newEntityId: string;
};

export const invitationIdAtom = atom<Invitation | undefined>("invitation-id", undefined);

// --- Helpers ----------------------------------------------------------------
const errorMsg = (message: string, ...args: any[]) => {
  message = `[${InvitationPluginMeta.id}]: ${message}`;

  if (args.length !== 0) {
    message = message + " " + JSON.stringify(args);
  }

  return message;
};

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/Invitation";

export enum InvitationIntent {
  CREATE_INVITATION = `${actionPrefix}/invite`,
  CREATE_GAME = `${actionPrefix}/create-game`,
  OPEN_GAME = `${actionPrefix}/open-game`,
  JOIN_INVITATION = `${actionPrefix}/mark-invitation-finalised`,
  CANCEL_INVITATION = `${actionPrefix}/mark-invitation-cancelled`,
}

export namespace InvitationIntent {
  export type CreateInvitation = {
    creatorId: string;
    gameDescription: GameDescription;
    isOpenGame: boolean;
  };
  export type CreateGame = Invitation;
  export type OpenGame = { gameId: string; instanceId: string };
  export type JoinInvitation = { invitationId: string };
  export type CancelInvitation = { invitationId: string };
}

type InvitationIntents = {
  [InvitationIntent.CREATE_INVITATION]: InvitationIntent.CreateInvitation;
  [InvitationIntent.CREATE_GAME]: InvitationIntent.CreateGame;
  [InvitationIntent.OPEN_GAME]: InvitationIntent.OpenGame;
  [InvitationIntent.JOIN_INVITATION]: InvitationIntent.JoinInvitation;
  [InvitationIntent.CANCEL_INVITATION]: InvitationIntent.CancelInvitation;
};

export const invitationIntent = mkIntentBuilder<InvitationIntents>(InvitationPluginMeta.id);

const intentResolver = (intent: Intent, plugins: Plugin[]) => {
  console.log("Invitation resolver", intent);
  const roomManagerPlugin = resolvePlugin(plugins, parseRoomManagerPlugin);

  if (!roomManagerPlugin) {
    throw new Error(`[${InvitationPluginMeta.id}]: Room manager not found`);
  }

  const space = roomManagerPlugin.provides.getActiveRoom();

  const intentPlugin = resolvePlugin(plugins, parseIntentPlugin);

  if (!intentPlugin) {
    throw new Error(`[${InvitationPluginMeta.id}]: Intent plugin not found`);
  }

  const dispatch = intentPlugin.provides.intent.dispatch;

  const clientPlugin = resolvePlugin(plugins, parseClientPlugin);

  if (!clientPlugin) {
    throw new Error(`[${InvitationPluginMeta.id}]: Client plugin not found`);
  }

  const identity = clientPlugin.provides.client.halo.identity.get();
  const identityHex = identity?.identityKey.toHex();

  if (!identityHex) {
    throw new Error(`[${InvitationPluginMeta.id}]: No identity found`);
  }

  match(intent.action as InvitationIntent)
    .with(InvitationIntent.CREATE_INVITATION, () => {
      const data = intent.data as InvitationIntent.CreateInvitation;

      const invitation: Invitation = {
        ...data,

        invitationId: uuid(),
        joiningPlayerId: undefined,
        finalised: false,
        cancelled: false,
        newEntityId: uuid(),
      };

      space.db.add(new Expando({ type: "invitation", ...invitation }));
      window.history.pushState({}, "", `/play-with-me/${invitation.invitationId}`);
    })
    .with(InvitationIntent.CREATE_GAME, () => {
      const data = intent.data as InvitationIntent.CreateGame;

      const gameProvides = gameProvidesAtom.value.find(
        (game) => game.id === data.gameDescription.gameId
      );

      if (!gameProvides) {
        throw new Error(
          errorMsg("Game provides not found for game id", data.gameDescription.gameId)
        );
      }

      if (!data.joiningPlayerId) {
        throw new Error(errorMsg("No joining player for invitation id", data.invitationId));
      }

      gameProvides.createGame(
        space,
        data.newEntityId,
        data.gameDescription.variantId,
        data.gameDescription.timeControl,
        { creatorId: data.creatorId, challengerId: data.joiningPlayerId },
        data.gameDescription.playerOrdering
      );

      dispatch(
        invitationIntent(InvitationIntent.OPEN_GAME, {
          gameId: data.gameDescription.gameId,
          instanceId: data.newEntityId,
        })
      );
    })
    .with(InvitationIntent.OPEN_GAME, () => {
      const { gameId, instanceId } = intent.data as InvitationIntent.OpenGame;
      window.history.pushState({}, "", `/game/${gameId}/${instanceId}`);
    })
    .with(InvitationIntent.JOIN_INVITATION, () => {
      const { invitationId } = intent.data as InvitationIntent.JoinInvitation;
      const { objects } = space.db.query({ type: "invitation", invitationId });
      const [invitation] = objects;

      if (invitation.creatorId !== identityHex) {
        console.log("We are the second player");

        invitation.joiningPlayerId = identityHex;
        invitation.finalised = true;

        dispatch(invitationIntent(InvitationIntent.CREATE_GAME, invitation as any));
      }
    })
    .with(InvitationIntent.CANCEL_INVITATION, () => {
      const { invitationId } = intent.data as InvitationIntent.JoinInvitation;
      const { objects } = space.db.query({ type: "invitation", invitationId });
      const [invitation] = objects;

      if (identityHex !== invitation.creatorId) {
        console.warn("Only the creator can cancel an invitation");
        return;
      }

      invitation.cancelled = true;
      window.history.pushState({}, "", "/");
    })
    .exhaustive();
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
