//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TurnIcon from '@material-ui/icons/ArrowLeft';
import SwapIcon from '@material-ui/icons/Cached';
import StartIcon from '@material-ui/icons/SkipPrevious';
import BackIcon from '@material-ui/icons/NavigateBefore';
import ForwardIcon from '@material-ui/icons/NavigateNext';
import EndIcon from '@material-ui/icons/SkipNext';

const useStyles = makeStyles(theme => ({
  table: {},
  container: ({ rows }) => ({
    maxHeight: 43 + rows * 33
  }),
  player: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1)
  },
  playerIndicator: {
    visibility: 'hidden'
  },
  playerTurn: {
    visibility: 'visible',
    color: 'green'
  },
  number: {
    width: 40,
    textAlign: 'right',
    backgroundColor: theme.palette.grey[100]
  },
  move: {
    width: 80,
    textAlign: 'left'
  }
}));

const Player = ({ name, turn }) => {
  const classes = useStyles();
  return (
    <div className={classes.player}>
      <div>{name}</div>
      <div className={clsx(classes.playerIndicator, turn && classes.playerTurn)}>
        <TurnIcon />
      </div>
    </div>
  );
};

const ChessPanel = ({ game, onToggleOrientation }) => {
  const classes = useStyles({ rows: 8 });

  const history = game.history({ verbose: true });
  const moves = history.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []);

  // nextPlayerColor={caption || (game && game.turn())}
  // console.log(game.turn());

  // TODO(burdon): Player names.
  // TODO(burdon): Player turn indicator (NOTE: this depends if we are playing!)
  // TODO(burdon): History buttons.
  // TODO(burdon): Stick moves to bottom.
  // TODO(burdon): Chess font for notation.

  return (
    <Paper>
      <Player name={'Player 1'} turn={game.turn() === 'w'} />

      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.table} aria-label="moves table">
          <TableHead className={classes.header}>
            <TableRow>
              <TableCell>
                <IconButton size="small" onClick={onToggleOrientation}>
                  <SwapIcon />
                </IconButton>
              </TableCell>
              <TableCell colSpan={2}>
                <IconButton size="small" onClick={() => {}}>
                  <StartIcon />
                </IconButton>
                <IconButton size="small" onClick={() => {}}>
                  <BackIcon />
                </IconButton>
                <IconButton size="small" onClick={() => {}}>
                  <ForwardIcon />
                </IconButton>
                <IconButton size="small" onClick={() => {}}>
                  <EndIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moves.map(([white, black], i) => (
              <TableRow key={i}>
                <TableCell className={classes.number}>{i + 1}</TableCell>
                <TableCell className={classes.move}>{white && white.san}</TableCell>
                <TableCell className={classes.move}>{black && black.san}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Player name={'Player 2'} turn={game.turn() === 'b'} />
    </Paper>
  );
};

export default ChessPanel;
