import { removeMany } from "$lib/db";
import { mkIntentBuilder } from "$lib/intent";
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
import { create } from "@dxos/react-client/echo";
import { PropsWithChildren } from "react";
import { atom } from "signia";
import { match } from "ts-pattern";
import { v4 as uuid } from "uuid";
import { routes } from "../Layout/routes";
import { parseRoomManagerPlugin } from "../RoomManager/room-manager-plugin";
import { GameProvides, PlayerOrdering } from "./GameProvides";
import { CreateGame } from "./components/CreateGame";
import { InvitationView } from "./components/Invitation";

// --- Constants and Metadata -------------------------------------------------
export const GamePluginMeta = { id: "Game", name: "Game plugin" };

// --- State ------------------------------------------------------------------
export const gameProvidesAtom = atom<GameProvides["game"][]>("game-provides", []);

// TODO(Zan): Add variant here
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
  instanceId: string;
};

export const invitationIdAtom = atom<Invitation | undefined>("invitation-id", undefined);

// --- Helpers ----------------------------------------------------------------
const errorMsg = (message: string, ...args: any[]) => {
  message = `[${GamePluginMeta.id}]: ${message}`;

  if (args.length !== 0) {
    message = message + " " + JSON.stringify(args);
  }

  return message;
};

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/Game";

export enum GameIntent {
  CREATE_INVITATION = `${actionPrefix}/invite`,
  CREATE_GAME = `${actionPrefix}/create-game`,
  OPEN_GAME = `${actionPrefix}/open-game`,
  JOIN_INVITATION = `${actionPrefix}/mark-invitation-finalised`,
  CANCEL_INVITATION = `${actionPrefix}/mark-invitation-cancelled`,
}

export namespace GameIntent {
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

type GameIntents = {
  [GameIntent.CREATE_INVITATION]: GameIntent.CreateInvitation;
  [GameIntent.CREATE_GAME]: GameIntent.CreateGame;
  [GameIntent.OPEN_GAME]: GameIntent.OpenGame;
  [GameIntent.JOIN_INVITATION]: GameIntent.JoinInvitation;
  [GameIntent.CANCEL_INVITATION]: GameIntent.CancelInvitation;
};

export const gameIntent = mkIntentBuilder<GameIntents>(GamePluginMeta.id);

const intentResolver = async (intent: Intent, plugins: Plugin[]) => {
  const roomManagerPlugin = resolvePlugin(plugins, parseRoomManagerPlugin);

  if (!roomManagerPlugin) {
    throw new Error(`[${GamePluginMeta.id}]: Room manager not found`);
  }

  const space = roomManagerPlugin.provides.getActiveRoom();
  await space.waitUntilReady();

  const intentPlugin = resolvePlugin(plugins, parseIntentPlugin);

  if (!intentPlugin) {
    throw new Error(`[${GamePluginMeta.id}]: Intent plugin not found`);
  }

  const dispatch = intentPlugin.provides.intent.dispatch;

  const clientPlugin = resolvePlugin(plugins, parseClientPlugin);

  if (!clientPlugin) {
    throw new Error(`[${GamePluginMeta.id}]: Client plugin not found`);
  }

  const identity = clientPlugin.provides.client.halo.identity.get();
  const identityHex = identity?.identityKey.toHex();

  if (!identityHex) {
    throw new Error(`[${GamePluginMeta.id}]: No identity found`);
  }

  match(intent.action as GameIntent)
    .with(GameIntent.CREATE_INVITATION, () => {
      const data = intent.data as GameIntent.CreateInvitation;

      const invitation: Invitation = {
        ...data,

        invitationId: uuid(),
        joiningPlayerId: undefined,
        finalised: false,
        cancelled: false,
        instanceId: uuid(),
      };

      const { objects } = space.db.query({
        type: "invitation",
        creatorId: invitation.creatorId,
        cancelled: false,
        finalised: false,
      });

      removeMany(space.db, objects);

      space.db.add(create({ type: "invitation", ...invitation }));
      window.history.pushState({}, "", routes.invitation(invitation.invitationId));
    })
    .with(GameIntent.CREATE_GAME, () => {
      const data = intent.data as GameIntent.CreateGame;

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
        data.instanceId,
        data.gameDescription.variantId,
        data.gameDescription.timeControl,
        { creatorId: data.creatorId, challengerId: data.joiningPlayerId },
        data.gameDescription.playerOrdering
      );

      dispatch(
        gameIntent(GameIntent.OPEN_GAME, {
          gameId: data.gameDescription.gameId,
          instanceId: data.instanceId,
        })
      );
    })
    .with(GameIntent.OPEN_GAME, () => {
      const { gameId, instanceId } = intent.data as GameIntent.OpenGame;
      window.history.pushState({}, "", routes.game(gameId, instanceId));
    })
    .with(GameIntent.JOIN_INVITATION, () => {
      const { invitationId } = intent.data as GameIntent.JoinInvitation;
      const { objects } = space.db.query({ type: "invitation", invitationId });
      const [invitation] = objects;

      if (invitation.creatorId !== identityHex) {
        invitation.joiningPlayerId = identityHex;
        invitation.finalised = true;

        dispatch(gameIntent(GameIntent.CREATE_GAME, invitation as any));
      }
    })
    .with(GameIntent.CANCEL_INVITATION, () => {
      const { invitationId } = intent.data as GameIntent.JoinInvitation;
      const { objects } = space.db.query({ type: "invitation", invitationId });
      const [invitation] = objects;

      if (identityHex !== invitation.creatorId) {
        console.warn("Only the creator can cancel an invitation");
        return;
      }

      invitation.cancelled = true;
      window.history.pushState({}, "", routes.root);
    })
    .exhaustive();
};

// --- Plugin Definition ------------------------------------------------------
type GamePluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides;

export default function GamePlugin(): PluginDefinition<GamePluginProvidesCapabilities> {
  return {
    meta: GamePluginMeta,
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
            return <CreateGame />;
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
