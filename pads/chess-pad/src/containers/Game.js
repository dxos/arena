//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import MessengerPad from '@dxos/messenger-pad';

import ChessPad from '../components/ChessPad';
import { useChessModel } from '../model';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  messengerContainer: {
    maxWidth: 700
  }
}));

// TODO(burdon): Remove (ChessPad should be outer container.)
const Game = ({ topic, itemId }) => {
  const classes = useStyles();
  const chessModel = useChessModel(topic, itemId);
  const [messengerOpen, setMessengerOpen] = useState(false);
  if (!chessModel) {
    return <p>{'Game model is not loaded'}</p>;
  }

  const makeMove = (move) => chessModel.model.makeMove(move);

  return (
    <div className={classes.root}>
      <ChessPad
        partyKey={topic}
        chessModel={chessModel}
        onMove={makeMove}
        onToggleMessenger={() => setMessengerOpen(oldValue => !oldValue)}
      />
      {messengerOpen && (
        <div className={classes.messengerContainer}>
          <MessengerPad.main
            topic={topic}
            itemId={itemId}
          />
        </div>
      )}
    </div>
  );
};

export default Game;
