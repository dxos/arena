import {
  IntentResolverProvides,
  PluginDefinition,
  Surface,
  SurfaceProvides,
  useIntent,
} from "@dxos/app-framework";
import { match as pathMatch } from "path-to-regexp";
import React, { PropsWithChildren, useEffect } from "react";
import { atom } from "signia";
import { useValue } from "signia-react";
import { match } from "ts-pattern";
import { mkIntentBuilder } from "../lib";
import { Layout } from "./Layout";

// --- Layout Constants and Metadata -------------------------------------------
export const LayoutPluginMeta = { id: "layout", name: "Layout Plugin" };

// --- Layout State ------------------------------------------------------------
type ViewState =
  | { type: "uninitialized" }
  | { type: "lobby" }
  | { type: "invitation"; invitationId: string }
  | { type: "game"; gameId: string };

export const layoutStateAtom = atom<ViewState>("layout", { type: "lobby" });

// --- Layout Intents ---------------------------------------------------------
const actionPrefix = "@arena.dxos.org/layout";

export enum LayoutIntent {
  OPEN_LOBBY = `${actionPrefix}/open-lobby`,
  OPEN_INVITATION = `${actionPrefix}/open-invitation`,
}

export namespace LayoutIntent {
  export type OpenLobby = undefined;
  export type OpenInvitation = { invitationId: string };
}

type LayoutIntents = {
  [LayoutIntent.OPEN_LOBBY]: LayoutIntent.OpenLobby;
  [LayoutIntent.OPEN_INVITATION]: LayoutIntent.OpenInvitation;
};

export const layoutIntent = mkIntentBuilder<LayoutIntents>(LayoutPluginMeta.id);

// --- Plugin Definition ------------------------------------------------------
type LayoutPluginProvidesCapabilities = IntentResolverProvides & SurfaceProvides;

export default function LayoutPlugin(): PluginDefinition<LayoutPluginProvidesCapabilities> {
  return {
    meta: LayoutPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>, // TODO(Zan): Add MOSAIC root?

      intent: {
        resolver(intent, _plugins) {
          console.log("Layout Intent Resolver", intent);

          switch (intent.action) {
            case LayoutIntent.OPEN_INVITATION: {
              layoutStateAtom.set({ type: "invitation", invitationId: intent.data.invitationId });
              return true;
            }
            case LayoutIntent.OPEN_LOBBY: {
              layoutStateAtom.set({ type: "lobby" });
              return true;
            }
          }
        },
      },
      surface: { component: ({ role }) => (role === "main" ? <Layout /> : null) },
      root: () => {
        const layoutState = useValue(layoutStateAtom);
        const { dispatch } = useIntent();

        const appPaths = [
          ["lobby", "/"],
          ["invitation", "/play-with-me/:id"],
          ["game", "/game/:id"],
        ] as const;

        const handleNavigation = () => {
          // console.log("handleNavigation", window.location);
          const path = window.location.pathname;

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
            const { id } = params as any as { id: string };

            // TODO(Zan): Make pattern matching more robust by matching on route and params.
            match(route)
              .with("lobby", () => dispatch(layoutIntent(LayoutIntent.OPEN_LOBBY)))
              .with("invitation", () =>
                dispatch(layoutIntent(LayoutIntent.OPEN_INVITATION, { invitationId: id }))
              )
              .run();
          }
        };

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
        }, [layoutState]);

        useEffect(() => {
          handleNavigation();
        }, []);

        // Note: Here is where we can inject data into the rendered surface.
        return <Surface role="main" />;
      },
    },
  };
}
