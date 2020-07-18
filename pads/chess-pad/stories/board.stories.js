//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Box from '@material-ui/core/Box';

import Chess from 'chess.js';

import ChessPad from '../src/components/ChessPad';
import ChessPanel from '../src/components/ChessPanel';

storiesOf('Chess', module)
  .add('Board', () => {
    const [game, setGame] = useState();

    useEffect(() => {
      const game = new Chess();
      for (let i = 0; i < 19; i++) {
        const moves = game.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        game.move(move);
      }

      setGame(game);
    }, []);

    return (
      <ChessPad
        game={game}
        onMove={move => {
          const newGame = new Chess();
          game.history().forEach(move => newGame.move(move));
          newGame.move(move);
          setGame(newGame);
        }}
      />
    );
  })
  .add('Panel', () => {
    const [game, setGame] = useState();
    const [position, setPosition] = useState(0);

    useEffect(() => {
      const game = new Chess();
      for (let i = 0; i < 19; i++) {
        const moves = game.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        game.move(move);
      }

      setGame(game);
    }, []);

    return (
      <Box m={2}>
        <ChessPanel
          game={game}
          position={position}
          onSetPosition={setPosition}
        />
      </Box>
    );
  });
