//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { useAppRouter } from '@dxos/react-appkit';

import ChessPad from './ChessPad';
import { useChessModel } from '../model';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing(3),
    overflow: 'auto',
    overflowX: 'hidden'
  },
  game: {
    display: 'flex',
    overflow: 'hidden'
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    alignItems: 'center'
  },
  gridItemTitle: {
    marginTop: 10,
    cursor: 'pointer',

    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}));

// TODO(burdon): Grid is currently a non-responsive hack.
// TODO(burdon): Remove (ChessPad should be outer container.)
const Game = ({ topic, viewId }) => {
  const [game, makeMove, gameModel] = useChessModel(topic, viewId);
  if (!gameModel || !gameModel.isInitialized) {
    return null;
  }

  return (
    <ChessPad
      gameId={viewId}
      game={game}
      onMove={makeMove}
      showPabel={false}
      maxWidth={220}
    />
  );
};

const ChessGrid = ({ boards, topic }) => {
  const classes = useStyles();
  const router = useAppRouter();

  if (!boards) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.grid}
      >
        {boards.map(item => (
          <Grid
            item
            key={item.viewId}
            className={classes.gridItem}
            lg={3}
            md={3}
            sm={3}
          >
            <Game topic={topic} viewId={item.viewId} />
            <Typography
              className={classes.gridItemTitle}
              onClick={() => router.push({ path: '/app', topic, item: item.viewId })}
            >
              {item.displayName}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ChessGrid;
