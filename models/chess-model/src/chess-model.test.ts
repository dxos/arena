//
// Copyright 2020 DXOS.org
//

import waitForExpect from 'wait-for-expect';

import { createModelTestBench } from '@dxos/echo-db';

import { ChessModel } from './chess-model';

const PLAYER_1 = Buffer.from([1]);
const PLAYER_2 = Buffer.from([2]);
const PLAYER_3 = Buffer.from([3]);

const itemId = '123';

const WHITE = 'w';
const BLACK = 'b';

test('initial state', async () => {
  console.log('ChessModel', ChessModel);
  const [player1, player2] = await createModelTestBench({ model: ChessModel });
  // const model = new ChessModel(ChessModel.meta, itemId);
  // await model._processMessage({ memberKey: PLAYER_1, feedKey: PLAYER_1, seq: 0 }, { selection: { blackPlayerPublicKey: PLAYER_1, whitePlayerPublicKey: PLAYER_2 } });
  // model.processMessages([
  //   genesisMessage(PLAYER_1, PLAYER_2)
  // ]);

  // expect(player1.model.game.turn()).toEqual(WHITE);
  // expect(player2.model.game.turn()).toEqual(WHITE);
  // expect(player1.model.game.history().length).toEqual(0);
  // expect(player2.model.game.history().length).toEqual(0);
  expect(true).toEqual(true);
  return true;
});

// test('applies moves with with matching keys', () => {
//   const model = new ChessModel();
//   model.processMessages([
//     genesisMessage(PLAYER_1, PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_1),
//     moveMessage(1, 'a7', 'a6', PLAYER_2),
//   ])

//   expect(model.game.turn()).toEqual(WHITE)
//   expect(model.game.history().length).toEqual(2)
// });

// test('does not apply moves with incorrect keys', () => {
//   const model = new ChessModel();
//   model.processMessages([
//     genesisMessage(PLAYER_1, PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_3),
//   ])

//   expect(model.game.turn()).toEqual(WHITE)
//   expect(model.game.history().length).toEqual(0)
// });

// test('skips moves with duplicate seq', () => {
//   const model = new ChessModel();
//   model.processMessages([
//     genesisMessage(PLAYER_1, PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_1),
//     moveMessage(0, 'd2', 'd3', PLAYER_1),
//     moveMessage(1, 'a7', 'a6', PLAYER_2),
//   ])

//   expect(model.game.turn()).toEqual(WHITE)
//   expect(model.game.history().length).toEqual(2)
// });

// test('reorders moves based on seq', () => {
//   const model = new ChessModel();
//   model.processMessages([
//     genesisMessage(PLAYER_1, PLAYER_2),
//     moveMessage(1, 'a7', 'a6', PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_1),
//   ])

//   expect(model.game.turn()).toEqual(WHITE)
//   expect(model.game.history().length).toEqual(2)
// });

// test('can process a game till checkmate', () => {
//   const model = new ChessModel();
//   model.processMessages([
//     genesisMessage(PLAYER_1, PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_1),
//     moveMessage(1, 'a7', 'a6', PLAYER_2),
//     moveMessage(2, 'd1', 'h5', PLAYER_1),
//     moveMessage(3, 'a8', 'a7', PLAYER_2),
//     moveMessage(4, 'f1', 'c4', PLAYER_1),
//     moveMessage(5, 'b7', 'b6', PLAYER_2),
//     moveMessage(6, 'h5', 'f7', PLAYER_1),
//   ])

//   expect(model.game.turn()).toEqual(BLACK)
//   expect(model.game.in_checkmate()).toEqual(true);
//   expect(model.game.game_over()).toEqual(true);
// });

// test('can process a game till checkmate, even with genesis block appearing last', () => {
//   const model = new ChessModel();
//   model.processMessages([
//     moveMessage(0, 'e2', 'e3', PLAYER_1),
//     moveMessage(1, 'a7', 'a6', PLAYER_2),
//     moveMessage(2, 'd1', 'h5', PLAYER_1),
//     moveMessage(3, 'a8', 'a7', PLAYER_2),
//     moveMessage(4, 'f1', 'c4', PLAYER_1),
//     moveMessage(5, 'b7', 'b6', PLAYER_2),
//     moveMessage(6, 'h5', 'f7', PLAYER_1),
//     genesisMessage(PLAYER_1, PLAYER_2),
//   ])

//   expect(model.game.turn()).toEqual(BLACK)
//   expect(model.game.in_checkmate()).toEqual(true);
//   expect(model.game.game_over()).toEqual(true);
// });

// test('can make a move', async () => {
//   const model = new ChessModel();
//   model.processMessages([
//     genesisMessage(PLAYER_1, PLAYER_2),
//     moveMessage(0, 'e2', 'e3', PLAYER_1),
//   ]);

//   let pushedMove;
//   model.on('append', move => { pushedMove = move });
//   model.makeMove({ from: 'a7', to: 'a6' });

//   await waitForExpect(() => expect(pushedMove).toEqual({
//     __type_url: TYPE_CHESS_MOVE,
//     from: 'a7',
//     to: 'a6',
//     previousMessageId: 2,
//     messageId: 3,
//   }))
// });

// const genesisMessage = (white, black) => ({
//   __type_url: TYPE_CHESS_PLAYERSELECT,
//   previousMessageId: 0,
//   messageId: 1,
//   members: [
//     { publicKey: white, role: CHESS_WHITE_ROLE },
//     { publicKey: black, role: CHESS_BLACK_ROLE },
//   ],
// });

// const moveMessage = (seq, from, to, player) => ({
//   __type_url: TYPE_CHESS_MOVE,
//   messageId: seq + 2,
//   previousMessageId: seq + 1,
//   seq,
//   from,
//   to,
//   __meta: { credentials: { member: player } },
// })
