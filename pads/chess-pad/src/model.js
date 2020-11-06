//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { CHESS_TYPE_CONTENT } from '@dxos/chess-model';
import { keyToBuffer } from '@dxos/crypto';
import { useItems } from '@dxos/react-client';

/**
 * Provides game state and a way to make moves.
 * @param topic
 * @param itemId
 * @returns {[Object[], function, Object]}
 */
export const useChessModel = (topic, itemId) => {
  assert(topic);
  assert(itemId);
  assert(CHESS_TYPE_CONTENT);
  const partyKey = keyToBuffer(topic);

  const [chessModel] = useItems({ partyKey, parent: itemId, type: CHESS_TYPE_CONTENT });

  return chessModel;
};
