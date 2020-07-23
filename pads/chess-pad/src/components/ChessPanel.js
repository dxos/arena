//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

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
    tableLayout: 'fixed',
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

const ChessPanel = ({ party, game, position = -1, onSetPosition, onToggleOrientation, orientation }) => {
  const [playerOneName, setPlayerOneName] = useState('Player 1');
  const [playerTwoName, setPlayerTwoName] = useState('Player 2');
  const classes = useStyles({ rows: 8 });

  useEffect(() => {
    party.members[0] && setPlayerOneName(party.members[0].displayName);
    party.members[1] && setPlayerTwoName(party.members[1].displayName);
  }, [party.members]);

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
        name={orientation === 'white' ? playerTwoName : playerOneName}
        turn={game.turn() === (orientation === 'white' ? 'b' : 'w')}
      />

      <TableContainer className={classes.table}>
        <Table stickyHeader size="small" aria-label="chess moves">
          <TableHead className={classes.header}>
            <TableRow>
              <TableCell style={{ width: 80 }}>
                <IconButton size="small" onClick={onToggleOrientation}>
                  <SwapIcon />
                </IconButton>
              </TableCell>
              <TableCell style={{ width: 160 }} colSpan={2}>
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
        name={orientation === 'white' ? playerOneName : playerTwoName}
        turn={game.turn() === (orientation === 'white' ? 'w' : 'b')}
      />
    </Paper>
  );
};

export default ChessPanel;
