//
// Copyright 2020 DxOS.
//

import { createCLI } from '@dxos/cli-core';

import { GameModule } from './modules/game';

import info from '../extension.yml';

module.exports = createCLI(
  {
    modules: [GameModule],
    dir: __dirname,
    main: !module.parent,
    info
  }
);
