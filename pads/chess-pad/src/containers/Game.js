//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { usePads, useViews } from '@dxos/react-appkit';

import { useChessModel } from '../model';
import ChessPad from '../components/ChessPad';
import CustomSettingsDialog from './CustomSettingsDialog';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    // TODO(burdon): Don't use custom CSS. flex: 1 (follow existing patterns).
    height: '100%',
    width: '100%'
  }
}));

// TODO(burdon): Callbacks should be onXXX.
// TODO(burdon): Individual Game class SHOULD NOT open all views. Pass in the item!
const Game = ({ viewSettingsOpen = false, setViewSettingsOpen = () => {} }) => {
  const classes = useStyles();
  const { topic, item: viewId } = useParams();
  const [pads] = usePads();
  const { model: viewModel } = useViews(topic);
  const [game, makeMove, gameModel] = useChessModel(topic, viewId);

  // TODO(burdon): Remove adhoc "Loading" UX.
  if (!gameModel || !viewModel) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      <div className={classes.root}>
        <ChessPad
          gameId={viewId}
          game={game}
          onMove={makeMove}
        />
      </div>

      {/* TODO(burdon): Remove from here -- standardize display of settings. */}
      {/* TODO(burdon): Should be in form of <ItemSettings><ChessSettings /></ItemSettings> */}
      <CustomSettingsDialog
        open={viewSettingsOpen || !gameModel.isInitialized}
        onClose={() => setViewSettingsOpen(false)}
        viewModel={viewModel}
        gameModel={gameModel}
        pads={pads}
        viewId={viewId}
      />
    </>
  );
};

export default Game;
