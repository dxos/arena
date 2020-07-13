//
// Copyright 2020 DXOS.org
//

import { Bot } from '@dxos/botkit';
import { keyToString } from '@dxos/crypto';
import { TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';

/**
 * Chess bot.
 */
export class ChessBot extends Bot {
  /**
   * @type {Set}
   */
  _parties = new Set();

  /**
   * @type {Map<String, {itemId: String, color: String}>}
   */
  _games = new Map();

  async start () {
    await super.start();

    this._publicKey = this._client.partyManager.identityManager.publicKey;

    this._client.partyManager.on('party', async topic => {
      await this.playInParty(keyToString(topic));
    });

    const parties = this._client.partyManager._parties.keys();

    if (parties.length > 1) {
      await Promise.all(parties.slice(1).map(async topic => {
        await this.playInParty(topic);
      }));
    }
  }

  /**
   * Play in party.
   * @param {String} topic
   */
  async playInParty (topic) {
    if (!this._parties.has(topic)) {
      console.log(`Joining party '${topic}'.`);
      this._parties.add(topic);

      const model = await this._client.modelFactory.createModel(undefined, { type: [TYPE_CHESS_PLAYERSELECT], topic });

      model.on('update', async () => {
        if (model.messages) {
          for (const message of model.messages) {
            const { itemId, members } = message;
            const [white, black] = members;

            const isWhite = white.publicKey.equals(this._publicKey);
            const isBlack = black.publicKey.equals(this._publicKey);

            if (isWhite || isBlack) {
              if (!this._games.has(itemId)) {
                this.joinGame(topic, itemId, isWhite, isBlack);
              }
            }
          }
        }
      });
    }
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

    const model = await this._client.modelFactory.createModel(ChessModel, { type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT], topic, itemId });
    model.on('update', async () => {
      if ((model.game.turn() === 'b' && isBlack) || (model.game.turn() === 'w' && isWhite)) {
        const moves = model.game.moves({ verbose: true });
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];

          console.log(`Making move in game '${itemId}': ${JSON.stringify(move)}`);
          model.makeMove(move);
        }
      }
    });
  }
}
