//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid as GridUI, Typography } from '@material-ui/core';

import Game from '../containers/Game';

const useStyles = makeStyles(() => ({
  grid: {
    marginTop: 50,
    width: '80%',
    maxWidth: 1200
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350
  },
  gridItemTitle: {
    marginTop: 10
  },
  container: {
    overflow: 'auto',
    overflowX: 'hidden',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const ChessGrid = ({ boards, topic }) => {
  const classes = useStyles();

  if (!boards) return null;

  return (
    <div className={classes.container}>
      <GridUI
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.grid}
      >
        {boards.map(item => (
              <GridUI
                item
                key={item.viewId}
                className={classes.gridItem}
              >
                <Game
                  grid
                  topic={topic}
                  viewId={item.viewId}
                />
                <Typography className={classes.gridItemTitle}>{item.displayName}</Typography>
              </GridUI>
            )
          )}
      </GridUI>
    </div>
  );
};

export default ChessGrid;
