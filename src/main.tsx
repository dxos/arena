import "@dxosTheme";

import { registerSignalRuntime } from "@dxos/echo-signals";
import { createRoot } from "react-dom/client";

import ClientMeta from "@braneframe/plugin-client/meta";
import GraphMeta from "@braneframe/plugin-graph/meta";
import MetadataMeta from "@braneframe/plugin-metadata/meta";
import SpaceMeta from "@braneframe/plugin-space/meta";
import ThemeMeta from "@braneframe/plugin-theme/meta";

import { createApp, Plugin } from "@dxos/app-framework";
import { createStorageObjects } from "@dxos/client-services";
import { Config, Defaults, defs, Envs, Local } from "@dxos/config";
import { createClientServices } from "@dxos/react-client";
import { Status, ThemeProvider, Tooltip } from "@dxos/react-ui";
import { defaultTx } from "@dxos/react-ui-theme";

import { ChessPluginMeta } from "./plugins/Chess/chess-plugin";
import { ConnectFourAdvancedPluginMeta } from "./plugins/ConnectFourAdvanced/connect-four-advanced-plugin";
import { GamePluginMeta } from "./plugins/Game/game-plugin";
import { LayoutPluginMeta } from "./plugins/Layout/layout-plugin";
import { RoomManagerPluginMeta } from "./plugins/RoomManager/room-manager-plugin";
import { SynthPluginMeta } from "./plugins/Synth/synth-plugin";
import { ToasterPluginMeta } from "./plugins/Toaster/toaster-plugin";

import "./fonts/fonts.css";

export const getConfig = () => new Config(Envs(), Local(), Defaults());

const createWorker = () =>
  new SharedWorker(new URL("./shared-worker", import.meta.url), {
    type: "module",
    name: "dxos-client-worker",
  });

const main = async () => {
  registerSignalRuntime();
  let config = await getConfig();

  const services = await createClientServices(
    config,
    config.values.runtime?.app?.env?.DX_HOST ? undefined : () => createWorker()
  );

  const App = createApp({
    placeholder: (
      <ThemeProvider tx={defaultTx}>
        <div className="flex bs-[100dvh] justify-center items-center">
          <Status indeterminate aria-label="Initializing" />
        </div>
      </ThemeProvider>
    ),
    plugins: {
      [ThemeMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-theme"), {
        appName: "Arena App",
      }),
      [GraphMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-graph")),
      [MetadataMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-metadata")),
      [ClientMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-client"), {
        appKey: "schrodie.dxos.network",
        shell: "./shell.html",
        config,
        services,
      }),
      [SpaceMeta.id]: Plugin.lazy(() => import("@braneframe/plugin-space")),
      [ToasterPluginMeta.id]: Plugin.lazy(() => import("./plugins/Toaster/toaster-plugin")),
      [RoomManagerPluginMeta.id]: Plugin.lazy(
        () => import("./plugins/RoomManager/room-manager-plugin")
      ),
      [SynthPluginMeta.id]: Plugin.lazy(() => import("./plugins/Synth/synth-plugin")),
      [LayoutPluginMeta.id]: Plugin.lazy(() => import("./plugins/Layout/layout-plugin")),
      [GamePluginMeta.id]: Plugin.lazy(() => import("./plugins/Game/game-plugin")),
      [ChessPluginMeta.id]: Plugin.lazy(() => import("./plugins/Chess/chess-plugin")),
      [ConnectFourAdvancedPluginMeta.id]: Plugin.lazy(
        () => import("./plugins/ConnectFourAdvanced/connect-four-advanced-plugin")
      ),
    },
    order: [
      ThemeMeta, // Outside of error boundary so error dialog is styled.

      ClientMeta,
      SpaceMeta,
      GraphMeta,
      MetadataMeta,
      LayoutPluginMeta,
      ToasterPluginMeta,
      RoomManagerPluginMeta,
      SynthPluginMeta,
      GamePluginMeta,
      ChessPluginMeta,
      ConnectFourAdvancedPluginMeta,
    ],
  });

  createRoot(document.getElementById("root")!).render(<App />);
};

const defaultStorageIsEmpty = async (config?: defs.Runtime.Client.Storage): Promise<boolean> => {
  try {
    const storage = createStorageObjects(config ?? {}).storage;
    const metadataDir = storage.createDirectory("metadata");
    const echoMetadata = metadataDir.getOrCreateFile("EchoMetadata");
    const { size } = await echoMetadata.stat();
    return !(size > 0);
  } catch (err) {
    console.warn("Checking for empty default storage.", { err });
    return true;
  }
};

void main();
