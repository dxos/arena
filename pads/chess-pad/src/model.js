//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chess from 'chess.js';

import { TYPE_CHESS_GAME, TYPE_CHESS_MOVE, TYPE_CHESS_PLAYERSELECT, ChessModel } from '@dxos/chess-core';
import { createId } from '@dxos/crypto';
import { useModel } from '@dxos/react-client';

// TODO(burdon): Define types.

/**
 * Provides item list and item creator.
 * @param {string} topic
 * @returns {[Object[], function]}
 */
export const useItemList = (topic) => {
  const model = useModel({ options: { type: TYPE_CHESS_GAME, topic } });

  // TODO(burdon): CRDT.
  const messages = model?.messages ?? [];
  const items = Object.values(messages.reduce((map, item) => {
    map[item.itemId] = item;
    return map;
  }, {}));

  return {
    items,
    createItem: opts => {
      const itemId = createId();
      model.appendMessage({ __type_url: TYPE_CHESS_GAME, itemId, ...opts });
      return itemId;
    },
    renameItem: (itemId, title) => {
      model.appendMessage({ __type_url: TYPE_CHESS_GAME, itemId, title });
    }
  };
};

/**
 * Provides item metadata and updater.
 * @param {string} topic
 * @param {string} itemId
 * @returns {[{title}, function]}
 */
export const useItem = (topic, itemId) => {
  const model = useModel({ options: { type: TYPE_CHESS_GAME, topic, itemId } });
  if (!model) {
    return [[]];
  }

  // TODO(burdon): CRDT.
  const { messages = [] } = model;
  const { title } = messages.length > 0 ? messages[messages.length - 1] : {};

  return [
    { title },
    ({ title }) => {
      model.appendMessage({ __type_url: TYPE_CHESS_GAME, itemId, title });
    }
  ];
};

/**
 * Provides game state and a way to make moves.
 * @param topic
 * @param itemId
 * @returns {[Object[], function]}
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
