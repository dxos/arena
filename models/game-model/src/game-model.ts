//
// Copyright 2020 DXOS.org
//

import { ModelMeta, Model } from '@dxos/model-factory';
import { MutationMeta } from '@dxos/echo-protocol';

import { GameMove, schema } from './proto';

export class GameModel extends Model<GameMove> {
  static meta: ModelMeta = {
    type: 'wrn://protocol.dxos.org/teamwork/messenger',
    mutation: schema.getCodecForType('dxos.arena.game.GameMove')
  };

  private readonly _gameMoves: GameMove[] = [];

  get gameMoves() {
    return this._gameMoves;
  }

  async _processMessage (meta: MutationMeta, message: GameMove) {
    this._gameMoves.push(message)
    return true;
  }

  async move(message: GameMove) {
    const receipt = await this.write(message);
    await receipt.waitToBeProcessed();
  }
}
