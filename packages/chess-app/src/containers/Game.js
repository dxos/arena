//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// import { Channel } from '@dxos/messenger-components';

import ChessPad from '../components/ChessPad';
import MovesPad from '../components/MovesPad';
import { useChessModel } from '../model';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '100px minmax(400px, 1fr) 1fr',
    gridColumnGap: '8px',
    height: '100%',
  },
}));

const Game = () => {
  const classes = useStyles();
  const { topic, item: gameId } = useParams();
  const [game, makeMove] = useChessModel(topic, gameId);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <MovesPad history={game.history({ verbose: true })} />
        <ChessPad gameId={gameId} game={game} makeMove={makeMove} />
        {/* <Channel narrow /> */}
      </div>
    </div>
  );
};

export default Game;
