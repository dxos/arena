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
  table: ({ rows }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 43 + rows * 33
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
    textAlign: 'left',
    cursor: 'pointer'
  },
  current: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.info.light + '33'
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

const ChessPanel = ({ game, position = -1, onSetPosition, onToggleOrientation, orientation }) => {
  const classes = useStyles({ rows: 8 });
  if (!game) {
    return null;
  }

  const history = game.history({ verbose: true });
  const moves = history.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }

    return result;
  }, []);

  // TODO(burdon): Player names.
  // TODO(burdon): Player turn indicator (NOTE: this depends if we are playing!)

  return (
    <Paper>
      <Player
        name={orientation === 'white' ? 'Player 2' : 'Player 1'}
        turn={game.turn() === (orientation === 'white' ? 'b' : 'w')}
      />

      <TableContainer className={classes.table}>
        <Table stickyHeader size="small" aria-label="moves table">
          <TableHead className={classes.header}>
            <TableRow>
              <TableCell>
                <IconButton size="small" onClick={onToggleOrientation}>
                  <SwapIcon />
                </IconButton>
              </TableCell>
              <TableCell colSpan={2}>
                <IconButton size="small" onClick={() => onSetPosition(0)}>
                  <StartIcon />
                </IconButton>
                <IconButton size="small" onClick={() => position > 0 && onSetPosition(position - 1)}>
                  <BackIcon />
                </IconButton>
                <IconButton size="small" onClick={() => position < history.length && onSetPosition(position + 1)}>
                  <ForwardIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onSetPosition(history.length)}>
                  <EndIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moves.map(([white, black], i) => (
              <TableRow key={i}>
                <TableCell
                  className={classes.number}>{i + 1}
                </TableCell>
                <TableCell
                  onClick={() => onSetPosition(i * 2 + 1)}
                  className={clsx(classes.move, position === (i * 2 + 1) && classes.current)}>{white && white.san}
                </TableCell>
                <TableCell
                  onClick={() => onSetPosition(i * 2 + 2)}
                  className={clsx(classes.move, position === (i * 2 + 2) && classes.current)}>{black && black.san}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Player
        name={orientation === 'white' ? 'Player 1' : 'Player 2'}
        turn={game.turn() === (orientation === 'white' ? 'w' : 'b')}
      />
    </Paper>
  );
};

export default ChessPanel;
