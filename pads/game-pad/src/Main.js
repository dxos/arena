//
// Copyright 2020 DXOS.org
//

import React from 'react';
import clsx from 'clsx';

import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

import { GameModel } from '@dxos/game-model';
import { useModel } from '@dxos/react-client';

import Game from './Game';

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
  model.appendMessage({
    __type_url: 'testing.game.tictactoe-move',
    position,
    piece,
    move
  });
};

export default function TicTacToePad (props) {
  const { className, topic, viewId, ...cardProps } = props;
  const classes = useStyles();
  const model = useModel({
    model: GameModel,
    options: { topic, viewId, type: 'testing.game.tictactoe-move' }
  });

  return (
    <Card className={clsx(classes.root, className)} {...cardProps}>
      {model && <Game game={model.state.game} onMove={onMove(model)} classes={{ root: classes.gameCard }} />}
    </Card>
  );
}
