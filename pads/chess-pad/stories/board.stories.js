//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { storiesOf } from '@storybook/react';
import Box from '@material-ui/core/Box';

import Chess from 'chess.js';

import ChessPad from '../src/components/ChessPad';
import ChessPanel from '../src/components/ChessPanel';

storiesOf('Chess', module)
  .add('Board', () => {
    const game = new Chess();

    for (let i = 0; i < 19; i++) {
      const moves = game.moves();
      const move = moves[Math.floor(Math.random() * moves.length)];
      game.move(move);
    }

    return (
      <ChessPad game={game} />
    );
  })
  .add('Panel', () => {
    const game = new Chess();

    for (let i = 0; i < 19; i++) {
      const moves = game.moves();
      const move = moves[Math.floor(Math.random() * moves.length)];
      game.move(move);
    }

    return (
      <Box m={2}>
        <ChessPanel game={game} />
      </Box>
    );
  });
