//
// Copyright 2020 DXOS.org
//

import { createCLI } from '@dxos/cli-core';

import info from '../extension.yml';
import { GameModule } from './modules/game';

module.exports = createCLI(
  {
    modules: [GameModule],
    dir: __dirname,
    main: !module.parent,
    info
  }
);
