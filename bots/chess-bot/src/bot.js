//
// Copyright 2020 DXOS.org
//

import { sleep } from '@dxos/async';
import { Bot } from '@dxos/botkit';
import { TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';

/**
 * Chess bot.
 */
export class ChessBot extends Bot {
  /**
   * @type {Map<String, {itemId: String, color: String}>}
   */
  _games = new Map();

  constructor (config) {
    super(config);

    this.on('party', async (topic) => {
      await this.joinParty(topic);
    });
  }

  /**
   * Join party.
   * @param {String} topic
   */
  async joinParty (topic) {
    console.log(`Joining party '${topic}'.`);

    const self = this._client.partyManager.identityManager.publicKey;
    const model = await this._client.modelFactory.createModel(undefined, { type: [TYPE_CHESS_PLAYERSELECT], topic });

    model.on('update', async () => {
      if (model.messages) {
        for (const message of model.messages) {
          const { itemId, members } = message;
          const [white, black] = members;

          const isWhite = white.publicKey.equals(self);
          const isBlack = black.publicKey.equals(self);

          if (isWhite || isBlack) {
            if (!this._games.has(itemId)) {
              this.joinGame(topic, itemId, isWhite, isBlack);
            }
          }
        }
      }
    });
  }

  /**
   * Play game.
   * @param {String} topic
   * @param {String} itemId
   * @param {String} color
   */
  async joinGame (topic, itemId, isWhite, isBlack) {
    console.log(`Joining game '${itemId}'`);
    isWhite && console.log('Playing white.');
    isBlack && console.log('Playing black.');

    this._games.set(itemId, { itemId, isWhite, isBlack });

    const model = await this._client.modelFactory.createModel(ChessModel, {
      type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT],
      topic,
      itemId
    });

    model.on('update', async () => {
      console.log(`\nGame '${itemId}':\n${model.game.ascii()}`);
      if ((model.game.turn() === 'b' && isBlack) || (model.game.turn() === 'w' && isWhite)) {
        const move = await this.getNextMove(model.game);
        if (move) {
          console.log(`Making move: ${JSON.stringify(move)}`);
          await sleep(1200);
          model.makeMove(move);
        }
      }
    });
  }

  async getNextMove (game) {
    const moves = game.moves({ verbose: true });
    return (moves.length > 0) ? moves[Math.floor(Math.random() * moves.length)] : null;
  }
}
