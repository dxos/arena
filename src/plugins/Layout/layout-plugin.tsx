import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  Surface,
  SurfaceProvides,
  useIntent,
} from "@dxos/app-framework";
import { useClient } from "@dxos/react-client";
import { InvitationEncoder } from "@dxos/react-client/invitations";
import { match as pathMatch } from "path-to-regexp";
import { PropsWithChildren, useCallback, useEffect } from "react";
import { atom } from "signia";
import { match } from "ts-pattern";
import { RoomManagerIntent, roomManagerIntent } from "../RoomManager/room-manager-plugin";
import { mkIntentBuilder } from "../../lib";
import { Layout } from "./components/Layout";
import { appPaths } from "./routes";

// --- Layout Constants and Metadata -------------------------------------------
export const LayoutPluginMeta = { id: "layout", name: "Layout Plugin" };

// --- Layout State ------------------------------------------------------------
type ViewState =
  | { type: "uninitialized" }
  | { type: "lobby" }
  | { type: "create-invitation" }
  | { type: "invitation"; invitationId: string }
  | { type: "game"; gameId: string; instanceId: string }
  | { type: "choose-room" }
  | { type: "manage-room" }
  | { type: "not-found" };

export const layoutStateAtom = atom<ViewState>("layout", {
  type: "lobby",
});

export const searchParamsAtom = atom<URLSearchParams>(
  "search-params",
  new URLSearchParams(window.location.search)
);

// --- Layout Intents ---------------------------------------------------------
const actionPrefix = "@arena.dxos.org/layout";

export enum LayoutIntent {
  OPEN_LOBBY = `${actionPrefix}/open-lobby`,
  OPEN_CREATE_INVITATION = `${actionPrefix}/navigate-to-create-invitation`,
  OPEN_INVITATION = `${actionPrefix}/open-invitation`,
  OPEN_GAME = `${actionPrefix}/open-game`,
  CHOOSE_ROOM = `${actionPrefix}/choose-room`,
  MANAGE_ROOM = `${actionPrefix}/manage-room`,
  PRESENT_404 = `${actionPrefix}/present-404`,
  UPDATE_SEARCH_PARAMS = `${actionPrefix}/update-search-params`,
}

export namespace LayoutIntent {
  export type OpenLobby = undefined;
  export type NavigateToCreateInvitation = undefined;
  export type OpenInvitation = { invitationId: string };
  export type OpenGame = { gameId: string; instanceId: string };
  export type ChooseRoom = undefined;
  export type ManageRoom = undefined;
  export type Present404 = undefined;
  export type UpdateSearchParams = { searchParams: URLSearchParams };
}

type LayoutIntents = {
  [LayoutIntent.OPEN_LOBBY]: LayoutIntent.OpenLobby;
  [LayoutIntent.OPEN_CREATE_INVITATION]: LayoutIntent.NavigateToCreateInvitation;
  [LayoutIntent.OPEN_INVITATION]: LayoutIntent.OpenInvitation;
  [LayoutIntent.OPEN_GAME]: LayoutIntent.OpenGame;
  [LayoutIntent.CHOOSE_ROOM]: LayoutIntent.ChooseRoom;
  [LayoutIntent.MANAGE_ROOM]: LayoutIntent.ManageRoom;
  [LayoutIntent.PRESENT_404]: LayoutIntent.Present404;
  [LayoutIntent.UPDATE_SEARCH_PARAMS]: LayoutIntent.UpdateSearchParams;
};

export const layoutIntent = mkIntentBuilder<LayoutIntents>(LayoutPluginMeta.id);

// --- Layout Intent Resolver --------------------------------------------------
function resolver(intent: Intent, _plugins: Plugin[]) {
  console.log("Layout Intent Resolver", intent);

  return match(intent.action as LayoutIntent)
    .with(LayoutIntent.UPDATE_SEARCH_PARAMS, () => {
      const { searchParams } = intent.data;
      searchParamsAtom.set(searchParams);
      return true;
    })
    .with(LayoutIntent.OPEN_CREATE_INVITATION, () => {
      layoutStateAtom.set({ type: "create-invitation" });
      return true;
    })
    .with(LayoutIntent.OPEN_INVITATION, () => {
      layoutStateAtom.set({ type: "invitation", invitationId: intent.data.invitationId });
      return true;
    })
    .with(LayoutIntent.OPEN_LOBBY, () => {
      layoutStateAtom.set({ type: "lobby" });
      return true;
    })
    .with(LayoutIntent.OPEN_GAME, () => {
      const { gameId, instanceId } = intent.data;
      layoutStateAtom.set({ type: "game", gameId, instanceId });
      return true;
    })
    .with(LayoutIntent.CHOOSE_ROOM, () => {
      layoutStateAtom.set({ type: "choose-room" });
      return true;
    })
    .with(LayoutIntent.MANAGE_ROOM, () => {
      layoutStateAtom.set({ type: "manage-room" });
      return true;
    })
    .with(LayoutIntent.PRESENT_404, () => {
      layoutStateAtom.set({ type: "not-found" });
      return true;
    })
    .exhaustive();
}

// --- Plugin Definition ------------------------------------------------------
type LayoutPluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides;

export default function LayoutPlugin(): PluginDefinition<LayoutPluginProvidesCapabilities> {
  return {
    meta: LayoutPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: { resolver },
      surface: { component: ({ role }) => (role === "main" ? <Layout /> : null) },
      root: () => {
        const { dispatch } = useIntent();

        const client = useClient();

        const handleNavigation = useCallback(() => {
          const path = window.location.pathname;
          const searchParams = new URLSearchParams(window.location.search);

          dispatch(layoutIntent(LayoutIntent.UPDATE_SEARCH_PARAMS, { searchParams }));

          if (searchParams.has("spaceInvitationCode")) {
            const removeSpaceInvitationCodeParam = () => {
              searchParams.delete("spaceInvitationCode");
              window.history.replaceState(
                {},
                "",
                `${window.location.pathname}?${searchParams.toString()}`
              );
            };

            const invitationCode = searchParams.get("spaceInvitationCode")!;
            const invitation = InvitationEncoder.decode(invitationCode);

            const alreadyJoinedSpace = client.spaces
              .get()
              .find((space) => space.key.toHex() === invitation.spaceKey?.toHex());

            if (alreadyJoinedSpace) {
              dispatch(
                roomManagerIntent(RoomManagerIntent.JOIN_ROOM, {
                  room: {
                    key: alreadyJoinedSpace.key.toHex(),
                    name: alreadyJoinedSpace.properties?.name,
                  },
                  noRedirect: true,
                })
              );
            } else {
              client.shell.joinSpace({ invitationCode }).then((joinSpaceResult) => {
                console.log("Join space result", joinSpaceResult);
                const space = joinSpaceResult.space;

                if (space) {
                  dispatch(
                    roomManagerIntent(RoomManagerIntent.JOIN_ROOM, {
                      room: { key: space.key.toHex(), name: space.properties?.name },
                      noRedirect: true,
                    })
                  );
                }
              });
            }

            removeSpaceInvitationCodeParam();
          }

          // Iterate through app paths and find the first match.
          const foundMatch = appPaths
            .map(([route, appPath]) => {
              const matcher = pathMatch(appPath, { decode: decodeURIComponent });
              const matchResult = matcher(path);

              return [route, matchResult] as const;
            })
            .filter(([, matchResult]) => matchResult !== false);

          console.log("Route match result", foundMatch);

          if (foundMatch.length > 0 && foundMatch[0][1] !== false) {
            const [route, { params }] = foundMatch[0];
            const { id, gameId } = params as any as { id: string; gameId: string };

            match(route)
              .with("lobby", () => dispatch(layoutIntent(LayoutIntent.OPEN_LOBBY)))
              .with("create-invitation", () =>
                dispatch(layoutIntent(LayoutIntent.OPEN_CREATE_INVITATION))
              )
              .with("invitation", () =>
                dispatch(layoutIntent(LayoutIntent.OPEN_INVITATION, { invitationId: id }))
              )
              .with("game", () =>
                dispatch(layoutIntent(LayoutIntent.OPEN_GAME, { gameId: gameId, instanceId: id }))
              )
              .with("choose-room", () => dispatch(layoutIntent(LayoutIntent.CHOOSE_ROOM)))
              .with("manage-room", () => dispatch(layoutIntent(LayoutIntent.MANAGE_ROOM)))
              .exhaustive();
          } else {
            dispatch(layoutIntent(LayoutIntent.PRESENT_404));
          }
        }, [client, dispatch]);

        // Update selection based on browser navigation.
        useEffect(() => {
          const originalPushState = window.history.pushState;

          window.history.pushState = function (state, title, url) {
            originalPushState.call(window.history, state, title, url);
            handleNavigation();
          };

          const originalReplaceState = window.history.replaceState;

          window.history.replaceState = function (state, title, url) {
            originalReplaceState.call(window.history, state, title, url);
            handleNavigation();
          };

          window.addEventListener("popstate", handleNavigation);

          return () => {
            window.removeEventListener("popstate", handleNavigation);
            // Restore the original functions
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
          };
        }, [handleNavigation]);

        // Invoke the navigation handler when the callback is updated. (A bit jank but it works. ¯\_(ツ)_/¯)
        useEffect(() => handleNavigation(), [handleNavigation]);

        // Note: Here is where we can inject data into the rendered surface.
        return <Surface role="main" />;
      },
    },
  };
}
