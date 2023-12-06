import "@dxosTheme";

import React from "react";
import { createRoot } from "react-dom/client";

import ClientMeta from "@braneframe/plugin-client/meta";
import ErrorMeta from "@braneframe/plugin-error/meta";
import GraphMeta from "@braneframe/plugin-graph/meta";
import LayoutMeta from "@braneframe/plugin-layout/meta";
import MetadataMeta from "@braneframe/plugin-metadata/meta";
import NavTreeMeta from "@braneframe/plugin-navtree/meta";
import SpaceMeta from "@braneframe/plugin-space/meta";
import StackMeta from "@braneframe/plugin-stack/meta";
import ThemeMeta from "@braneframe/plugin-theme/meta";
import { MyPluginMeta } from "./my-plugin";

import { createApp, Plugin } from "@dxos/app-framework";
import { types } from "@braneframe/types";
import { ThemeProvider } from "@dxos/react-ui";
import { defaultTx } from "@dxos/react-ui-theme";
import { Config, Defaults, Envs, Local } from "@dxos/config";
import { createClientServices, Remote } from "@dxos/react-client";

const main = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  // TODO(burdon): Add monolithic flag. Currently, can set `target=file://local`.
  const config = new Config(
    Remote(searchParams.get("target") ?? undefined),
    Envs(),
    Local(),
    Defaults()
  );

  const services = await createClientServices(config);
  const debugIdentity = config?.values.runtime?.app?.env?.DX_DEBUG;

  const App = createApp({
    fallback: (
      <ThemeProvider tx={defaultTx}>
        <div className="flex bs-[100dvh] justify-center items-center">
          fallback
        </div>
      </ThemeProvider>
    ),
    plugins: {
      [ThemeMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-theme"), {
        appName: "Arena App",
      }),
      [ErrorMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-error")),
      [GraphMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-graph")),
      [MetadataMeta.id]: Plugin.lazy(
        () => import("@braneframe/plugin-metadata")
      ),
      [LayoutMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-layout")),
      [NavTreeMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-navTree")),
      [ClientMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-client"), {
        appKey: "schrodie.dxos.network",
        config,
        services,
        types,
        debugIdentity,
      }),

      [SpaceMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-space")),
      [StackMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-stack")),
      [MyPluginMeta.id]: Plugin.lazy(() => import("./my-plugin")),
    },
    order: [
      // Outside of error boundary so error dialog is styled.
      ThemeMeta,

      // Outside of error boundary so that updates are not blocked by errors.
      ErrorMeta,

      LayoutMeta,
      NavTreeMeta,
      ClientMeta,
      SpaceMeta,
      GraphMeta,
      MetadataMeta,
      StackMeta,
      MyPluginMeta,
    ],
  });

  createRoot(document.getElementById("root")!).render(<App />);
};

void main();
