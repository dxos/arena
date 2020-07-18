//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { Chance } from 'chance';

import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { ViewSettingsDialog } from '@dxos/react-appkit';
import { ChessModel, TYPE_CHESS_PLAYERSELECT } from '@dxos/chess-core';
import { useParty } from '@dxos/react-client';

import PlayerSelect from '../components/PlayerSelect';

const chance = new Chance();

const useStyles = makeStyles(theme => ({
  playerDescription: {
    marginBottom: theme.spacing(2)
  }
}));

const CustomViewSettingsDialog = ({ open, onClose, viewModel, gameModel, viewId, pads }) => {
  const classes = useStyles();

  // TODO(burdon): Circular hooks (this is already required in ancestor so pass it in since you're passing in models).
  const party = useParty();

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
  // TODO(burdon): CustomViewSettingsDialog shold not wrap ViewSettingsDialog -- other way around!
  return (
    <ViewSettingsDialog
      open={open}
      onClose={onClose}
      viewModel={viewModel}
      pads={pads}
      viewId={viewId}
      closingDisabled={!gameModel.isInitialized}
    >
      {/* TODO(burdon): Remove: trigger from createItem. */}
      {!gameModel.isInitialized && (
        <PlayerSelect party={party} onSelected={handlePlayerSelect} />
      )}

      {/* TODO(burdon): Remove since PlayerSelect shows this information. */}
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
