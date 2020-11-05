//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

// import MessengerPad from '@dxos/messenger-pad';

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
const Game = ({ party, topic, itemId }) => {
  const classes = useStyles();
  const [game, makeMove, gameModel] = useChessModel(topic, itemId);
  const [messengerOpen, setMessengerOpen] = useState(false);
  if (!gameModel || !gameModel.isInitialized) {
    return <p>{`Game model is ${!gameModel ? 'not loaded' : 'not initialized'}.`}</p>;
  }

  return (
    <div className={classes.root}>
      <ChessPad
        gameId={itemId}
        game={game}
        gameModel={gameModel}
        onMove={makeMove}
        party={party}
        onToggleMessenger={() => setMessengerOpen(oldValue => !oldValue)}
      />
      {/* {messengerOpen && (
        <div className={classes.messengerContainer}>
          <MessengerPad.main
            party={party}
            topic={topic}
            itemId={itemId}
          />
        </div>
      )} */}
    </div>
  );
};

export default Game;
