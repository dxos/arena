//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Chance } from 'chance';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ChessModel, TYPE_CHESS_PLAYERSELECT } from '@dxos/chess-core';
import { createId } from '@dxos/crypto';

import ChessPad from '../components/ChessPad';
import MovesPad from '../components/MovesPad';
import PlayerSelect from '../components/PlayerSelect';
import { useChessModel } from '../model';

const chance = new Chance();

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '100px minmax(400px, 1fr) 1fr',
    gridColumnGap: '8px',
    height: '100%'
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

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {!gameModel.isInitialized && (
          <PlayerSelect isVisible={true} onSelected={handlePlayerSelect} />
        )}
        {gameModel.isInitialized && (<>
          <MovesPad history={game.history({ verbose: true })} />
          <ChessPad gameId={gameId} game={game} makeMove={makeMove} />
        </>)}
      </div>
    </div>
  );
};

export default Game;
