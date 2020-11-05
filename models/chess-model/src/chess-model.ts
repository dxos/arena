//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import ChessJs, { ShortMove, Square } from 'chess.js';

import { MutationMeta } from '@dxos/echo-protocol';
import { ModelMeta, Model } from '@dxos/model-factory';

import { ChessContent, schema, ChessPlayerSelection, ChessMove } from './proto';
import { keyToString, PublicKey } from '@dxos/crypto';

// const Chess = (typeof define !== 'undefined') ? ChessJs : ChessJs.Chess;
const Chess = ChessJs.Chess;

export interface ChessModelProps {
  whitePlayerPublicKey: string,
  blackPlayerPublicKey: string,
}

export class ChessModel extends Model<ChessContent> {
  static meta: ModelMeta = {
    type: 'wrn://protocol.dxos.org/arena/chess',
    mutation: schema.getCodecForType('dxos.arena.chess.ChessContent'),

    async getInitMutation (props: ChessModelProps): Promise<ChessContent> {
      assert(props && props.whitePlayerPublicKey && props.blackPlayerPublicKey, 'Players not selected');
      return {
        selection: {
          whitePlayerPublicKey: props.whitePlayerPublicKey,
          blackPlayerPublicKey: props.blackPlayerPublicKey
        }
      };
    }
  };

  private _game = new ChessJs.Chess()
  private _whitePubKey = ''
  private _blackPubKey = ''

  /**
   * Whether the model is initialized with a genesis block of a chess game
   */
  get isInitialized () {
    return this._whitePubKey && this._blackPubKey;
  }

  get game () {
    return this._game;
  }

  get whitePubKey () {
    return this._whitePubKey;
  }

  get blackPubKey () {
    return this._blackPubKey;
  }

  async makeMove(move: ChessMove) {
    const receipt = await this.write({move});
    await receipt.waitToBeProcessed();
  }

  async _processMessage (meta: MutationMeta, message: ChessContent) {
    if (message.selection) {
      return await this._processSelection(message.selection)
    }
    else if (message.move) {
      return await this._processMove(meta, message.move)
    }
    return false;
  }

  private async _processSelection(selection: ChessPlayerSelection) {
    if (this.isInitialized) return false;
    if (!selection.blackPlayerPublicKey || !selection.blackPlayerPublicKey) return false;
    this._whitePubKey = selection.whitePlayerPublicKey;
    this._blackPubKey = selection.blackPlayerPublicKey;
    assert(this.isInitialized, 'initialization not successful');
    return true;
  }

  private async _processMove(meta: MutationMeta, move: ChessMove) {
    if (!this.isInitialized) {
      return false;
    }

    if (this.game.history().length !== move.turn) {
      return false;
    }

    const expectedPubKey = this.game.history().length % 2 === 0 ? this._whitePubKey : this._blackPubKey;
    if (!PublicKey.equals(expectedPubKey, meta.memberKey)) {
      return false;
    }

    const shortMove: ChessJs.ShortMove = {
      from: move.from as Square,
      to: move.to as Square,
      promotion: move.promotion as ShortMove['promotion']
    }
    if (!new Chess(this.game.fen()).move(shortMove)) {
      return false;
    }
    this._game.move(shortMove);
    return true;
  }
}
