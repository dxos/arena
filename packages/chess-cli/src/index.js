//
// Copyright 2020 DxOS.org
//

import { createCLI } from '@dxos/cli-core';

import { ChessModule } from './modules/chess';

import info from '../extension.yml';

module.exports = createCLI(
  {
    modules: [ChessModule],
    dir: __dirname,
    main: !module.parent,
    info
  }
);
