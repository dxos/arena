//
// Copyright 2020 DXOS.org
//

import { ChessModel } from '@dxos/chess-model';
import { createCLI } from '@dxos/cli-core';

import info from '../extension.yml';
import { ChessModule } from './modules/chess';

const initGameModel = async (state) => {
  state.models.push(ChessModel);
  state.chessModel = ChessModel;
};

module.exports = createCLI(
  {
    modules: [ChessModule],
    dir: __dirname,
    main: !module.parent,
    init: initGameModel,
    info
  }
);
