//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Chance } from 'chance';

import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { ViewSettingsDialog } from '@dxos/react-appkit';
import { ChessModel, TYPE_CHESS_PLAYERSELECT } from '@dxos/chess-core';

import PlayerSelect from '../components/PlayerSelect';

const chance = new Chance();

const useStyles = makeStyles(theme => ({
  playerDescription: {
    marginBottom: theme.spacing(2)
  }
}));

const CustomViewSettingsDialog = ({ open, onClose, viewModel, gameModel, viewId, pads }) => {
  const classes = useStyles();

  const handlePlayerSelect = (selection) => {
    if (!selection) {
      return;
    }

    const title = `game-${chance.word()}`;
    gameModel.appendMessage({
      __type_url: TYPE_CHESS_PLAYERSELECT,
      viewId,
      ...ChessModel.createGenesisMessage(title, selection.white, selection.black)
    });
  };

  // TODO(burdon): Show Black and White rows with Picker to select person.
  // TODO(burdon): closingDisabled???
  // TODO(burdon): value={'TODO'}???

  return (
    <ViewSettingsDialog
      open={open}
      onClose={onClose}
      viewModel={viewModel}
      pads={pads}
      viewId={viewId}
      closingDisabled={!gameModel.isInitialized}
    >
      {!gameModel.isInitialized && (
        <PlayerSelect onSelected={handlePlayerSelect} />
      )}
      {gameModel.isInitialized && (
        <>
          <TextField
            className={classes.playerDescription}
            fullWidth
            disabled
            label='White Player'
            variant='outlined'
            value={'TODO'}
          />
          <TextField
            className={classes.playerDescription}
            fullWidth
            disabled
            label='Black Player'
            variant='outlined'
            value={'TODO'}
          />
        </>
      )}
    </ViewSettingsDialog>
  );
};

export default CustomViewSettingsDialog;
