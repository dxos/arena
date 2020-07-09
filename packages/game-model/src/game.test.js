//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { Game } from './game';

const log = debug('test');

test('game', () => {
  const game = new Game();

  game.set('a1', 1);
  game.set('a2', 0);
  game.set('b3', 1);
  game.set('b2', 0);
  game.set('a3', 1);
  game.set('c2', 0);

  log(game.ascii());
  log(game.moves());

  expect(game.winner()).toEqual(0);
  expect(game.moves()).toEqual([
    { position: 'b1', piece: 1 },
    { position: 'c1', piece: 1 },
    { position: 'c3', piece: 1 }
  ]);
});
