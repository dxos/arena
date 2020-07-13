//
// Copyright 2020 DXOS.org
//

import { Bot } from '@dxos/botkit';
import { keyToString } from '@dxos/crypto';
import { CHESS_WHITE_ROLE, CHESS_BLACK_ROLE, TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';

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
      this._parties.add(topic);

      const model = await this._client.modelFactory.createModel(undefined, { type: [TYPE_CHESS_PLAYERSELECT], topic });

      model.on('update', async () => {
        if (model.messages) {
          for (const message of model.messages) {
            const { itemId, members } = message;
            const [white, black] = members;
            if (white.publicKey.equals(this._publicKey) || black.publicKey.equals(this._publicKey)) {
              if (!this._games.has(itemId)) {
                const color = white.publicKey.equals(this._publicKey) ? CHESS_WHITE_ROLE : CHESS_BLACK_ROLE;
                this.joinGame(topic, itemId, color);
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
  async joinGame (topic, itemId, color) {
    this._games.set(itemId, { itemId, color });

    const model = await this._client.modelFactory.createModel(ChessModel, { type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT], topic, itemId });
    model.on('update', async () => {
      if ((model.game.turn() === 'b' && color === CHESS_BLACK_ROLE) || (model.game.turn() === 'w' && color === CHESS_WHITE_ROLE)) {
        const moves = model.game.moves({ verbose: true });
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          model.makeMove(move);
        }
      }
    });
  }
}
