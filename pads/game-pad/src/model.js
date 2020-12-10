//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createId, keyToBuffer } from '@dxos/crypto';
import { GAME_TYPE_MOVE } from '@dxos/game-model';
import { useItems } from '@dxos/react-client';

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

  const [gameModel] = useItems({ partyKey, parent: gameId, type: GAME_TYPE_MOVE });

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
