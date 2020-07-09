//
// Copyright 2020 DXOS.org
//

import ChessJs from 'chess.js';
import assert from 'assert';

import { OrderedModel } from '@dxos/echodb';

const Chess = (typeof define !== 'undefined') ? ChessJs : ChessJs.Chess;

export const TYPE_CHESS_GAME = 'testing.chess.Game';
export const TYPE_CHESS_MOVE = 'testing.chess.Move';

export const CHESS_WHITE_ROLE = 'white';
export const CHESS_BLACK_ROLE = 'black';

export class ChessModel extends OrderedModel {
  _game = new Chess();

  get game () {
    return this._game;
  }

  /**
   * Make a move as one of the players
   * The public key must be consistent with corresponding public key
   * specified in the genesis block of the game
   * @param  {string} from
   * @param  {string} to
   * @param  {string} promotion
   */
  makeMove ({ from, to, promotion }) {
    if (!new Chess(this.game.fen()).move({ from, to, promotion })) {
      console.log('not a valid move', from, to);
      return;
    }
    this.appendMessage({ __type_url: TYPE_CHESS_MOVE, from, to, promotion });
  }

  /**
   * Update the game engine with new (ordered and validated) messages containing chess moves
   * @Override
   */
  async onUpdate (messages) {
    for (const message of messages) {
      if (message.__type_url === TYPE_CHESS_MOVE) {
        this._game.move(message);
      }
    }
  }

  /**
   * @Override
   */
  // eslint-disable-next-line no-unused-vars
  validateCandidate (intendedPosition, _message) {
    if (_message.__type_url === TYPE_CHESS_GAME) {
      assert(intendedPosition === 0);
      assert(_message.members);
      this._whitePubKey = _message.members.find(m => m.role === CHESS_WHITE_ROLE).publicKey;
      this._blackPubKey = _message.members.find(m => m.role === CHESS_BLACK_ROLE).publicKey;
      assert(this.isInitialized);
      return true;
    }

    return this._isKeyValid(intendedPosition, _message.__meta.credentials.member);
  }

  /**
   * Whether the model is initialized with a genesis block of a chess game
   */
  get isInitialized () {
    return this._whitePubKey && this._blackPubKey;
  }

  _isKeyValid (intendedPosition, key) {
    assert(this.isInitialized);
    assert(key);

    const expectedPubKey = intendedPosition % 2 === 1 ? this._whitePubKey : this._blackPubKey;
    return key.equals(expectedPubKey);
  }

  static createGenesisMessage (title, white, black) {
    return OrderedModel.createGenesisMessage({
      title,
      members: [
        { publicKey: white, role: CHESS_WHITE_ROLE },
        { publicKey: black, role: CHESS_BLACK_ROLE }
      ]
    });
  }
}
