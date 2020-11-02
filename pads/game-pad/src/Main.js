//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

import { GameModel, Game } from '@dxos/game-model';
import { useModel } from '@dxos/react-client';

import GameComponent from './GameComponent';
import { useGameModel } from './model';

const useStyles = makeStyles(() => ({
  root: {
    width: 250,
    margin: 'auto'
  },
  gameCard: {
    backgroundColor: '#fafafa'
  }
}), { name: 'TicTacToeMain' });



const TicTacToePad = (props) => {
  const { className, topic, itemId, ...cardProps } = props;
  const classes = useStyles();
  // const model = useModel({
  //   model: GameModel,
  //   options: { topic, itemId, type: 'testing.game.tictactoe-move' }
  // });

  const [gameModel, makeMove] = useGameModel(topic, itemId)

  if (!gameModel) return null;

  return (
    <Card className={clsx(classes.root, className)} {...cardProps}>
      {gameModel && <GameComponent game={gameModel.model.game} onMove={makeMove} classes={{ root: classes.gameCard }} />}
    </Card>
  );
};

export default TicTacToePad;
