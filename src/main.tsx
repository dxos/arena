import "@dxosTheme";

import React from "react";
import { createRoot } from "react-dom/client";

import ClientMeta from "@braneframe/plugin-client/meta";
import ErrorMeta from "@braneframe/plugin-error/meta";
import GraphMeta from "@braneframe/plugin-graph/meta";
import MetadataMeta from "@braneframe/plugin-metadata/meta";
import SpaceMeta from "@braneframe/plugin-space/meta";
import ThemeMeta from "@braneframe/plugin-theme/meta";
import { MyPluginMeta } from "./my-plugin";

import { types } from "@braneframe/types";
import { createApp, Layout, Plugin } from "@dxos/app-framework";
import { ThemeProvider } from "@dxos/react-ui";
import { defaultTx } from "@dxos/react-ui-theme";
import { Status } from "@dxos/react-ui";
import { LayoutPluginMeta } from "./Layout/layout-plugin";

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
    }),
    [SpaceMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-space")),

    [LayoutPluginMeta.id]: Plugin.lazy(() => import("./Layout/layout-plugin")),
    [MyPluginMeta.id]: Plugin.lazy(() => import("./my-plugin")),
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
    MyPluginMeta,
  ],
});

createRoot(document.getElementById("root")!).render(<App />);
