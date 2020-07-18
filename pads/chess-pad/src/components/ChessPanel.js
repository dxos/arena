//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import SwapIcon from '@material-ui/icons/Cached';
import { Toolbar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  table: {},
  container: ({ rows }) => ({
    maxHeight: rows * 33
  }),
  player: {
    padding: theme.spacing(1)
  },
  toolbar: {
    paddingLeft: theme.spacing(1)
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

const ChessPanel = ({ game, onToggleOrientation }) => {
  const classes = useStyles({ rows: 5 });

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
  // TODO(burdon): Player turn indicator.
  // TODO(burdon): History buttons.
  // TODO(burdon): Stick moves to bottom.
  // TODO(burdon): Chess font for notation.

  return (
    <Paper>
      <div className={classes.player}>Player 1</div>

      <Toolbar className={classes.toolbar} variant="dense" disableGutters>
        <IconButton size="small" onClick={onToggleOrientation}>
          <SwapIcon />
        </IconButton>
      </Toolbar>

      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.table} aria-label="moves table">
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

      <div className={classes.player}>Player 2</div>
    </Paper>
  );
};

export default ChessPanel;

// TODO(burdon): Constants
/*
{nextPlayerColor && (
  <div>
    <Typography variant='h6'>
      {nextPlayerColor === 'w' ? 'White player\'s turn' : 'Black player\'s turn'}
    </Typography>
  </div>
)}
*/
