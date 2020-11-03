//
// Copyright 2020 DXOS.org
//

import { createCLI } from '@dxos/cli-core';
import { GameModel } from '@dxos/game-model';

import info from '../extension.yml';
import { GameModule } from './modules/game';

const initGameModel = async (state) => {
  state.models.push(GameModel);
};

module.exports = createCLI(
  {
    modules: [GameModule],
    dir: __dirname,
    main: !module.parent,
    init: initGameModel,
    info
  }
);
