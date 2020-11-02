//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import BlankIcon from '@material-ui/icons/AddCircleOutline';
import CrossIcon from '@material-ui/icons/Clear';
import Avatar from '@material-ui/icons/GridOn';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';

const useStyles = makeStyles(() => ({
  root: {
    width: 250
  },

  board: {
    display: 'flex',
    justifyContent: 'center'
  },

  blank: {
    color: '#EEE'
  }
}), { name: 'TicTacToeMainGame' });

const GameComponent = ({ game, onMove, title, className, ...cardProps }) => {
  const classes = useStyles();

  const handleClick = (row, column) => {
    const position = 'abc'[row] + '123'[column];
    const { turn } = game;
    const move = game.move + 1;

    if (game.set(position, turn, move)) {
      onMove(position, turn, move);
    }
  };

  const winner = game.winner();
  const player = piece => 'OX'[piece];
  const subheader = winner !== undefined ? `${player(winner)} is the winner.`
    : game.isOver() ? 'stalemate' : `${player(game.turn)} to play`;

  const Icon = ({ piece, ...rest }) => (piece === undefined ? <BlankIcon {...rest} className={classes.blank} />
    : piece === 0 ? <CircleIcon {...rest} /> : <CrossIcon {...rest} />);

  return (
    <Card className={clsx(classes.root, className)} {...cardProps}>
      <CardHeader
        avatar={<Avatar />}
        title={title}
        subheader={subheader}
      />

      <CardContent>
        <div className={classes.board}>
          <table>
            <tbody>
              {game.board.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={`${i}-${j}`}>
                      <IconButton onClick={() => handleClick(i, j)}>
                        <Icon piece={game.board[i][j]} fontSize="large" />
                      </IconButton>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameComponent;
