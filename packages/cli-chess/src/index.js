//
// Copyright 2020 DXOS.org
//

import { createCLI } from '@dxos/cli-core';

import info from '../extension.yml';
import { ChessModule } from './modules/chess';

module.exports = createCLI(
  {
    modules: [ChessModule],
    dir: __dirname,
    main: !module.parent,
    info
  }
);
