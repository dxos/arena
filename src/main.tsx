import "@dxosTheme";

import React from "react";
import { createRoot } from "react-dom/client";

import ClientMeta from "@braneframe/plugin-client/meta";
import ErrorMeta from "@braneframe/plugin-error/meta";
import GraphMeta from "@braneframe/plugin-graph/meta";
import MetadataMeta from "@braneframe/plugin-metadata/meta";
import SpaceMeta from "@braneframe/plugin-space/meta";
import ThemeMeta from "@braneframe/plugin-theme/meta";

import { types } from "@braneframe/types";
import { createApp, Plugin } from "@dxos/app-framework";
import { Config, createClientServices, Defaults, Envs, Local } from "@dxos/react-client";
import { Status, ThemeProvider } from "@dxos/react-ui";
import { defaultTx } from "@dxos/react-ui-theme";

import { ChessPluginMeta } from "./Chess/chess-plugin";
import { InvitationPluginMeta } from "./Invitation/invitation-plugin";
import { LayoutPluginMeta } from "./Layout/layout-plugin";
import { RoomManagerPluginMeta } from "./RoomManager/room-manager-plugin";
import { SynthPluginMeta } from "./Synth/synth-plugin";
import { ToasterPluginMeta } from "./Toaster/toaster-plugin";

import "./fonts/fonts.css";
import { C16dPluginMeta } from "./c16d/c16d-plugin";

const main = async () => {
  const config = new Config(Envs(), Local(), Defaults());

  const services = await createClientServices(config);
  const debugIdentity = config?.values.runtime?.app?.env?.DX_DEBUG;

  const App = createApp({
    fallback: (
      <ThemeProvider tx={defaultTx}>
        <div className="flex bs-[100dvh] justify-center items-center">
          <Status indeterminate aria-label="Intitialising" />
        </div>
      </ThemeProvider>
    ),
    plugins: {
      [ThemeMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-theme"), {
        appName: "Arena App",
      }),
      [ErrorMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-error")),
      [GraphMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-graph")),
      [MetadataMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-metadata")),
      [ClientMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-client"), {
        appKey: "schrodie.dxos.network",
        types,
        services,
        config,
        debugIdentity,
      }),
      [SpaceMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-space")),
      [ToasterPluginMeta.id]: Plugin.lazy(() => import("./Toaster/toaster-plugin")),
      [RoomManagerPluginMeta.id]: Plugin.lazy(() => import("./RoomManager/room-manager-plugin")),

      [SynthPluginMeta.id]: Plugin.lazy(() => import("./Synth/synth-plugin")),
      [LayoutPluginMeta.id]: Plugin.lazy(() => import("./Layout/layout-plugin")),
      [InvitationPluginMeta.id]: Plugin.lazy(() => import("./Invitation/invitation-plugin")),
      [ChessPluginMeta.id]: Plugin.lazy(() => import("./Chess/chess-plugin")),
      [C16dPluginMeta.id]: Plugin.lazy(() => import("./c16d/c16d-plugin")),
    },
    order: [
      ThemeMeta, // Outside of error boundary so error dialog is styled.

      ErrorMeta,
      ClientMeta,
      SpaceMeta,
      GraphMeta,
      MetadataMeta,
      LayoutPluginMeta,
      ToasterPluginMeta,
      RoomManagerPluginMeta,
      SynthPluginMeta,
      InvitationPluginMeta,
      ChessPluginMeta,
      C16dPluginMeta,
    ],
  });

  createRoot(document.getElementById("root")!).render(<App />);
};

void main();
