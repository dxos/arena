//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Chessboard from 'chessboardjsx';

import Grid from '@material-ui/core/Card';

import { useViews } from '@dxos/react-appkit';

import { useChessModel } from '../model';

const ChessBoard = ({ topic, item }) => {
  const [game, makeMove, gameModel] = useChessModel(topic, item.viewId);

  return (
    <Chessboard
      position={game.fen()}
    />
  );
};

const ChessGrid = ({ topic }) => {
  const { model } = useViews(topic);

  return (
    <Grid container>
      {model.getAllViews().map(item => (
        <Grid key={item.viewId} item>
          <ChessBoard item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ChessGrid;
