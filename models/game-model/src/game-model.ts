//
// Copyright 2020 DXOS.org
//

import { ModelMeta, Model } from '@dxos/model-factory';
import { MutationMeta } from '@dxos/echo-protocol';

import { GameMove, schema } from './proto';
import { Game } from './game';

export class GameModel extends Model<GameMove> {
  static meta: ModelMeta = {
    type: 'wrn://protocol.dxos.org/teamwork/messenger',
    mutation: schema.getCodecForType('dxos.arena.game.GameMove')
  };

  private readonly _gameMoves: GameMove[] = [];
  private readonly _game = new Game();

  get gameMoves() {
    return this._gameMoves;
  }

  get game() {
    return this._game;
  }

  async _processMessage (meta: MutationMeta, message: GameMove) {
    this._gameMoves.push(message)
    const { position, piece, move } = message;
    this._game.set(position, piece, move);
    return true;
  }

  async move(message: GameMove) {
    const receipt = await this.write(message);
    await receipt.waitToBeProcessed();
  }
}
