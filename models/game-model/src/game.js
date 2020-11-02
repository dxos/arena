//
// Copyright 2020 DXOS.org
//

import { Model } from '@dxos/model-factory';

const lines = [
  ['a1', 'a2', 'a3'],
  ['b1', 'b2', 'b3'],
  ['c1', 'c2', 'c3'],

  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],

  ['a1', 'b2', 'c3'],
  ['a3', 'b2', 'c1']
];

const squares = [
  'a1', 'a2', 'a3',
  'b1', 'b2', 'b3',
  'c1', 'c2', 'c3'
];

/**
 * Noughts-and-crosses game.
 */
export class Game {
  _move = 0;

  _turn = 0;

  _state = [...new Array(3)].map(() => [...new Array(3)]);

  get move () {
    return this._move;
  }

  get turn () {
    return this._turn;
  }

  get board () {
    return this._state;
  }

  ascii () {
    const rows = [];
    const pieces = 'ox';
    this._state.forEach((row, i) => {
      rows.push(row.map(c => (c === undefined ? ' ' : pieces[c])).join('|'));
      if (i < 2) {
        rows.push('-+-+-');
      }
    });

    return rows.join('\n');
  }

  isOver () {
    return this._move === 9 || this.winner() !== undefined;
  }

  winner () {
    let winner;
    lines.forEach((line) => {
      const count = [0, 0];

      line.forEach((position) => {
        const { row, column } = this.position(position);
        const piece = this._state[row][column];
        if (piece !== undefined) {
          count[piece]++;
        }
      });

      count.forEach((value, i) => {
        if (value === 3) {
          winner = i;
        }
      });
    });

    return winner;
  }

  result () {
    const winner = this.winner();
    return (winner === undefined ? '-' : winner);
  }

  // eslint-disable-next-line class-methods-use-this
  position (position) {
    if (position.length !== 2) {
      throw new Error(`Illegal move: ${position}`);
    }

    const row = 'abc'.indexOf(position[0]);
    const column = '123'.indexOf(position[1]);

    if (row === -1 || column === -1) {
      throw new Error(`Illegal move: ${position}`);
    }

    return { row, column };
  }

  // TODO(burdon): Legal player?
  // TODO(burdon): CRDT: reference previous move.
  set (position, piece, move) {
    if (this.isOver()) {
      return false;
    }

    if (this.move >= move) {
      return false;
    }

    const { row, column } = this.position(position);
    const current = this._state[row][column];
    if (current !== undefined) {
      return false;
    }

    if (piece !== 0 && piece !== 1) {
      return false;
    }

    this._state[row][column] = piece;
    this._turn = 1 - piece;
    this._move = move;

    return true;
  }

  /**
   * Get legal moves.
   */
  moves () {
    return squares.filter(position => {
      const { row, column } = this.position(position);
      return (this._state[row][column] === undefined);
    }).map(position => ({ position, piece: this._turn }));
  }
}

/**
 * Stream adapter.
 */
export class GameModel extends Model {
  _game = new Game();

  get state () {
    return {
      game: this._game
    };
  }

  onUpdate (messages) {
    messages
      .sort((a, b) => a.move - b.move)
      .forEach(message => {
        const { position, piece, move } = message;
        this._game.set(position, piece, move);
      });
  }
}
