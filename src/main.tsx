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
import { Status, ThemeProvider } from "@dxos/react-ui";
import { defaultTx } from "@dxos/react-ui-theme";
import { ChessPluginMeta } from "./Chess/chess-plugin";
import { LayoutPluginMeta } from "./Layout/layout-plugin";
import { InvitationPluginMeta } from "./Invitation/invitation-plugin";
import { Config, Remote, Envs, Defaults, Local, createClientServices } from "@dxos/react-client";

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

      [LayoutPluginMeta.id]: Plugin.lazy(() => import("./Layout/layout-plugin")),
      [InvitationPluginMeta.id]: Plugin.lazy(() => import("./Invitation/invitation-plugin")),
      [ChessPluginMeta.id]: Plugin.lazy(() => import("./Chess/chess-plugin")),
    },
    order: [
      // Outside of error boundary so error dialog is styled.
      ThemeMeta,
      ErrorMeta,

      ClientMeta,
      SpaceMeta,
      GraphMeta,
      MetadataMeta,
      LayoutPluginMeta,
      InvitationPluginMeta,
      ChessPluginMeta,
    ],
  });

  createRoot(document.getElementById("root")!).render(<App />);
};

void main();
