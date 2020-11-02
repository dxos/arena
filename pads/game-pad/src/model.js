//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createId, keyToBuffer } from '@dxos/crypto';
import { useItems } from '@dxos/react-client';

export const GAME_PAD = 'dxos.org/pad/game';
export const GAME_TYPE_GAME = 'dxos.org/type/game/game';
export const MESSENGER_TYPE_MOVE = 'dxos.org/type/game/move';

/**
 * Provides game model.
 * @param topic
 * @param gameId
 * @returns {[Object, function]}
 */
export const useGameModel = (topic, gameId) => {
  assert(topic);
  assert(gameId);
  const partyKey = keyToBuffer(topic);

  const [gameModel] = useItems({ partyKey, parent: gameId, type: MESSENGER_TYPE_MOVE });

  if (!gameModel) {
    return [null, () => {}];
  }
  return [
    gameModel,
    (gameMove) => {
      const { position, piece, move } = gameMove;
      gameModel.model.move({
        id: createId(),
        position,
        piece,
        move
    });
  }];
};
