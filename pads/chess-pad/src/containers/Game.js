//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ChessPad from '../components/ChessPad';
import { useChessModel } from '../model';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    overflowX: 'auto'
  },
  messengerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  }
}));

// TODO(burdon): Remove (ChessPad should be outer container.)
const Game = ({ topic, itemId }) => {
  const classes = useStyles();
  const chessModel = useChessModel(topic, itemId);
  if (!chessModel) {
    return <p>{'Game model is not loaded'}</p>;
  }

  const makeMove = (move) => chessModel.model.makeMove(move);

  return (
    <div className={classes.root}>
      <ChessPad
        messengerItemId={itemId}
        partyKey={topic}
        chessModel={chessModel}
        onMove={makeMove}
      />
    </div>
  );
};

export default Game;
