//
// Copyright 2020 DXOS.org
//

import { sleep } from '@dxos/async';
import { Bot } from '@dxos/bot';
import { ChessModel, CHESS_TYPE_CONTENT } from '@dxos/chess-model';
import { keyToString, PublicKey } from '@dxos/crypto';

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

    this.on('party', async key => {
      await this.joinParty(key);
    });
  }

  async start () {
    await super.start();
    this._client.registerModel(ChessModel);

    this._self = this._client.getProfile().publicKey.asUint8Array();
  }

  /**
   * Join party.
   * @param {Buffer} key
   */
  async joinParty (key) {
    console.log(`Joining party '${keyToString(key)}'.`);

    const party = this._client.echo.getParty(PublicKey.from(key));

    const result = party.database.queryItems({ type: CHESS_TYPE_CONTENT });
    result.subscribe(async () => {
      await this.readGames(result.value);
    });
    await this.readGames(result.value);
  }

  async readGames (games) {
    for await (const game of games) {
      const isWhite = PublicKey.equals(game.model.whitePubKey, this._self);
      const isBlack = PublicKey.equals(game.model.blackPubKey, this._self);

      if (isWhite || isBlack) {
        if (!this._games.has(game.id)) {
          console.log(`Joining game '${game.id}'`);
          isWhite && console.log('Playing white.');
          isBlack && console.log('Playing black.');

          this._games.set(game.id, { game, isWhite, isBlack });

          game.subscribe(async () => {
            await this.playMove(game, isWhite, isBlack);
          });
          await this.playMove(game, isWhite, isBlack);
        }
      }
    }
  }

  /**
   * Play move.
   * @param {Object} game
   * @param {Boolean} isWhite
   * @param {Boolean} isBlack
   */
  async playMove (game, isWhite, isBlack) {
    const model = game.model;

    if ((model.game.turn() === 'b' && isBlack) || (model.game.turn() === 'w' && isWhite)) {
      const move = await this.getNextMove(model.game);
      if (move) {
        console.log(`Making move: ${JSON.stringify(move)}`);
        await sleep(1200);
        model.makeMove({ ...move, turn: model.length });
      }
    }
  }

  async getNextMove (game) {
    const moves = game.moves({ verbose: true });
    return (moves.length > 0) ? moves[Math.floor(Math.random() * moves.length)] : null;
  }
}
