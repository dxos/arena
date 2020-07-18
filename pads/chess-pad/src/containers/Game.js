//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { usePads, useViews } from '@dxos/react-appkit';

import ChessPad from '../components/ChessPad';

import { useChessModel } from '../model';
import CustomViewSettingsDialog from './CustomViewSettingsDialog';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
    width: '100%'
  }
}));

const Game = ({ viewSettingsOpen = false, setViewSettingsOpen = () => {} }) => {
  const classes = useStyles();
  const { topic, item: viewId } = useParams();
  const [pads] = usePads();
  const { model: viewModel } = useViews(topic, viewId);
  const [game, makeMove, gameModel] = useChessModel(topic, viewId);

  if (!gameModel || !viewModel) {
    return (<p>Loading...</p>);
  }

  return (<>
    <div className={classes.root}>
      <ChessPad
        gameId={viewId}
        game={game}
        onMove={makeMove}
      />
    </div>

    <CustomViewSettingsDialog
      open={viewSettingsOpen || !gameModel.isInitialized}
      onClose={() => setViewSettingsOpen(false)}
      viewModel={viewModel}
      gameModel={gameModel}
      pads={pads}
      viewId={viewId}
    />
  </>);
};

export default Game;
