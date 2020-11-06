//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chess from 'chess.js';

import { CHESS_TYPE_CONTENT } from '@dxos/chess-model';
import { keyToBuffer } from '@dxos/crypto';
import { useModel, useItems } from '@dxos/react-client';

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
  // TODO(rzadp,marik-d,rburdon) Use ECHO.
  // const model = useModel({
  //   model: ChessModel,
  //   options: {
  //     type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT],
  //     topic,
  //     itemId
  //   }
  // });

  return chessModel;

  // return [
  //   model?.game ?? new Chess(), // TODO(burdon): Defensive: should assert if null.
  //   move => model.makeMove(move),
  //   model
  // ];
};
