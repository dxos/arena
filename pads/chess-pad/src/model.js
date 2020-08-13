//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chess from 'chess.js';

import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';
import { useModel } from '@dxos/react-client';

/**
 * Provides game state and a way to make moves.
 * @param topic
 * @param itemId
 * @returns {[Object[], function, Object]}
 */
export const useChessModel = (topic, itemId) => {
  assert(topic);
  assert(itemId);

  // TODO(rzadp,marik-d,rburdon) Use ECHO.
  const model = useModel({
    model: ChessModel,
    options: {
      type: [TYPE_CHESS_MOVE, TYPE_CHESS_GAME, TYPE_CHESS_PLAYERSELECT],
      topic,
      itemId
    }
  });

  return [
    model?.game ?? new Chess(), // TODO(burdon): Defensive: should assert if null.
    move => model.makeMove(move),
    model
  ];
};
