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
    flex: 1,
    overflow: 'hidden'
  }
}));

// TODO(burdon): Remove (ChessPad should be outer container.)
const Game = ({ party, topic, viewId }) => {
  const classes = useStyles();
  const [game, makeMove, gameModel] = useChessModel(topic, viewId);
  if (!gameModel || !gameModel.isInitialized) {
    return null;
  }

  return (
    <div className={classes.root}>
      <ChessPad
        gameId={viewId}
        game={game}
        gameModel={gameModel}
        onMove={makeMove}
        party={party}
      />
    </div>
  );
};

export default Game;
