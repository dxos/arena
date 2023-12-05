import "@dxosTheme";

import React from "react";
import { createRoot } from "react-dom/client";

import { ClientPlugin } from "@braneframe/plugin-client";
import { ErrorPlugin } from "@braneframe/plugin-error";
import { GraphPlugin } from "@braneframe/plugin-graph";
import { LayoutPlugin } from "@braneframe/plugin-layout";
import { MetadataPlugin } from "@braneframe/plugin-metadata";
import { NavTreePlugin } from "@braneframe/plugin-navtree";
import { SpacePlugin } from "@braneframe/plugin-space";
import { StackPlugin } from "@braneframe/plugin-stack";
import { ThemePlugin } from "@braneframe/plugin-theme";
import { TypedObject } from "@dxos/echo-schema";
import { createApp } from "@dxos/app-framework";
import { MyPlugin } from "./my-plugin";
import { types } from "@braneframe/types";

// TODO(wittjosiah): This ensures that typed objects are not proxied by deepsignal. Remove.
// https://github.com/luisherranz/deepsignal/issues/36
(globalThis as any)[TypedObject.name] = TypedObject;

const App = createApp({ plugins: [
  ThemePlugin({ appName: "My Composer" }),
  // Inside theme provider so that errors are styled.
  ErrorPlugin(),
  GraphPlugin(),
  MetadataPlugin(),

  // UX
  LayoutPlugin(),
  NavTreePlugin(),

  // Data
  ClientPlugin({ appKey: 'schrodie.dxos.network', types }),
  SpacePlugin(),
  StackPlugin(),
  MyPlugin(),
]});

createRoot(document.getElementById("root")!).render(<App />);
