//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useChessModel } from '../model';
import ChessPad from '../components/ChessPad';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    // TODO(burdon): Don't use custom CSS. flex: 1 (follow existing patterns).
    height: '100%',
    width: '100%'
  }
}));

// TODO(burdon): Callbacks should be onXXX.
const Game = ({ topic, viewId, grid }) => {
  const classes = useStyles();
  const [game, makeMove, gameModel] = useChessModel(topic, viewId);

  if (!gameModel) {
    return null;
  }

  if (!gameModel.isInitialized) {
    return null;
  }

  return (
    <>
      <div className={classes.root}>
        <ChessPad
          gameId={viewId}
          game={game}
          onMove={makeMove}
          grid={grid}
          maxWidth={grid && 300}
        />
      </div>
    </>
  );
};

export default Game;
