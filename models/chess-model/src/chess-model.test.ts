//
// Copyright 2020 DXOS.org
//

import { keyToString, createKeyPair } from '@dxos/crypto';

import { ChessModel } from './chess-model';
import { ChessContent } from './proto/gen/dxos/arena/chess';

const itemId = '123';

const PLAYER_1 = createKeyPair().publicKey;
const PLAYER_2 = createKeyPair().publicKey;
const PLAYER_3 = createKeyPair().publicKey;

const PLAYER_1_META = { memberKey: PLAYER_1, feedKey: PLAYER_1, seq: -1 };
const PLAYER_2_META = { memberKey: PLAYER_2, feedKey: PLAYER_2, seq: -1 };
const PLAYER_3_META = { memberKey: PLAYER_3, feedKey: PLAYER_3, seq: -1 };

const SELECTION: ChessContent = { selection: { whitePlayerPublicKey: keyToString(PLAYER_1), blackPlayerPublicKey: keyToString(PLAYER_2) } };

const WHITE = 'w';
const BLACK = 'b';

test('initial state', async () => {
  const model = new ChessModel(ChessModel.meta, itemId);
  await model._processMessage(PLAYER_1_META, SELECTION);

  expect(model.game.turn()).toEqual(WHITE);
  expect(model.game.turn()).toEqual(WHITE);
  expect(model.game.history().length).toEqual(0);
  expect(model.game.history().length).toEqual(0);
});

test('applies moves with with matching keys', async () => {
  const model = new ChessModel(ChessModel.meta, itemId);
  await model._processMessage(PLAYER_1_META, SELECTION);

  await model.processMessage(PLAYER_1_META, { move: { turn: 0, from: 'e2', to: 'e3' } });
  await model.processMessage(PLAYER_2_META, { move: { turn: 1, from: 'a7', to: 'a6' } });

  expect(model.game.turn()).toEqual(WHITE);
  expect(model.game.history().length).toEqual(2);
});

test('does not apply moves with incorrect keys', async () => {
  const model = new ChessModel(ChessModel.meta, itemId);
  await model._processMessage(PLAYER_1_META, SELECTION);

  await model.processMessage(PLAYER_2_META, { move: { turn: 0, from: 'e2', to: 'e3' } });
  await model.processMessage(PLAYER_3_META, { move: { turn: 0, from: 'e2', to: 'e3' } });

  expect(model.game.turn()).toEqual(WHITE);
  expect(model.game.history().length).toEqual(0);
});

test('skips moves with duplicate seq', async () => {
  const model = new ChessModel(ChessModel.meta, itemId);
  await model._processMessage(PLAYER_1_META, SELECTION);

  await model.processMessage(PLAYER_1_META, { move: { turn: 0, from: 'e2', to: 'e3' } });
  await model.processMessage(PLAYER_1_META, { move: { turn: 0, from: 'd2', to: 'd3' } });
  await model.processMessage(PLAYER_2_META, { move: { turn: 1, from: 'a7', to: 'a6' } });

  expect(model.game.turn()).toEqual(WHITE);
  expect(model.game.history().length).toEqual(2);
});

test('can process a game till checkmate', async () => {
  const model = new ChessModel(ChessModel.meta, itemId);
  await model._processMessage(PLAYER_1_META, SELECTION);

  await model.processMessage(PLAYER_1_META, { move: { turn: 0, from: 'e2', to: 'e3' } });
  await model.processMessage(PLAYER_2_META, { move: { turn: 1, from: 'a7', to: 'a6' } });
  await model.processMessage(PLAYER_1_META, { move: { turn: 2, from: 'd1', to: 'h5' } });
  await model.processMessage(PLAYER_2_META, { move: { turn: 3, from: 'a8', to: 'a7' } });
  await model.processMessage(PLAYER_1_META, { move: { turn: 4, from: 'f1', to: 'c4' } });
  await model.processMessage(PLAYER_2_META, { move: { turn: 5, from: 'b7', to: 'b6' } });
  await model.processMessage(PLAYER_1_META, { move: { turn: 6, from: 'h5', to: 'f7' } });

  expect(model.game.turn()).toEqual(BLACK);
  expect(model.game.history().length).toEqual(7);
  expect(model.game.in_checkmate()).toEqual(true);
});
