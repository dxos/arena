//
// Copyright 2020 DXOS.org
//

import { TYPE_CHESS_GAME, ChessModel } from '@dxos/chess-model';
import { createCLI } from '@dxos/cli-core';
import { createModelAdapter } from '@dxos/model-adapter';

import info from '../extension.yml';
import { ChessModule } from './modules/chess';

const initGameModel = async (state) => {
  const model = createModelAdapter(TYPE_CHESS_GAME, ChessModel);

  state.models.push(model);
  state.chessModel = model;
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
