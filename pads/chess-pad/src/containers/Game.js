//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Chance } from 'chance';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ChessModel, TYPE_CHESS_PLAYERSELECT } from '@dxos/chess-core';

import ChessPad from '../components/ChessPad';
import PlayerSelect from '../components/PlayerSelect';
import { useChessModel } from '../model';

const chance = new Chance();

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
    width: '100%'
  }
}));

const Game = () => {
  const classes = useStyles();
  const { topic, item: gameId } = useParams();
  const [game, makeMove, gameModel] = useChessModel(topic, gameId);

  const handlePlayerSelect = (selection) => {
    if (!selection) {
      return;
    }
    const title = `game-${chance.word()}`;
    gameModel.appendMessage({ __type_url: TYPE_CHESS_PLAYERSELECT, viewId: gameId, ...ChessModel.createGenesisMessage(title, selection.white, selection.black) });
  };

  if (!gameModel) return (<p>Loading...</p>);

  if (!gameModel.isInitialized) {
    return (<PlayerSelect onSelected={handlePlayerSelect} />);
  }

  return (
    <div className={classes.root}>
        <ChessPad gameId={gameId} game={game} makeMove={makeMove} />
    </div>
  );
};

export default Game;
