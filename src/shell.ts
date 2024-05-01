//
// Copyright 2023 DXOS.org
//

import "@dxos/shell/style.css";

// NOTE: This is using bundled output from @dxos/shell and does not automatically rebuild on changes.
//  This is intentional to demonstrate the use of the shell as an external dependency.
import { runShell } from "@dxos/shell";
import { Config, Defaults, Envs, Local } from "@dxos/config";

export const getConfig = () => new Config(Envs(), Local(), Defaults());

const main = async () => {
  const config = getConfig();
  await runShell(config);
};

void main();
