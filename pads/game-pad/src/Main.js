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

const useStyles = makeStyles(() => ({
  root: {
    width: 250,
    margin: 'auto'
  },
  gameCard: {
    backgroundColor: '#fafafa'
  }
}), { name: 'TicTacToeMain' });

const onMove = (model) => (position, piece, move) => {
  console.warn('on move on yet implemented')
  // model.appendMessage({
  //   __type_url: 'testing.game.tictactoe-move',
  //   position,
  //   piece,
  //   move
  // });
};

const TicTacToePad = (props) => {
  const { className, topic, itemId, ...cardProps } = props;
  const classes = useStyles();
  // const model = useModel({
  //   model: GameModel,
  //   options: { topic, itemId, type: 'testing.game.tictactoe-move' }
  // });

  const model = 'not yet implemented'
  const game = new Game();

  return (
    <Card className={clsx(classes.root, className)} {...cardProps}>
      {model && <GameComponent game={game} onMove={onMove(model)} classes={{ root: classes.gameCard }} />}
    </Card>
  );
};

export default TicTacToePad;
