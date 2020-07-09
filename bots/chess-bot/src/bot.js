//
// Copyright 2020 DXOS.org
//

import { Bot } from '@dxos/botkit';
import { ChessModel } from '@dxos/chess-core';

/**
 * Chess bot.
 */
export class ChessBot extends Bot {
  constructor (config) {
    super(ChessModel, config);
  }

  // eslint-disable-next-line class-methods-use-this
  async onModelUpdate (model) {
    if (model.game.turn() === 'b') {
      console.log('This is a black move, making a move...');
      const moves = model.game.moves({ verbose: true });
      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        model.makeMove(move);
      }
    }
  }
}
