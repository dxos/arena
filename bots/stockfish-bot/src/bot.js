//
// Copyright 2020 DXOS.org
//

import { ChessBot } from '@dxos/chess-bot';

import { NodeWorker } from './worker';

/**
 * Stockfish Chess bot.
 */
export class StockfishBot extends ChessBot {
  constructor (config) {
    super(config);

    this._worker = new NodeWorker();
    this._worker.init();
  }

  async getNextMove (game) {
    return this._worker.makeMove(game.fen());
  }
}
