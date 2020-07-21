//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import SecurityIcon from '@material-ui/icons/Security';
import { useTheme } from '@material-ui/styles';

import { humanize } from '@dxos/crypto';
import { MemberAvatar, getAvatarStyle } from '@dxos/react-appkit';

const sorter = (a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  selector: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  autocomplete: {
    display: 'flex',
    flex: 1
  },
  icon: {
    marginLeft: theme.spacing(3)
  }
}));

const PlayerSelector = ({ value, members, label, onSelect, disabled }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.selector}>
      <Autocomplete
        disabled={disabled}
        id="combo-box-demo"
        classes={{ root: classes.autocomplete }}
        options={members}
        getOptionLabel={(member) => member ? (member.displayName || humanize(member.publicKey)) : ''}
        renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
        value={value || ''}
        onChange={(_, member) => {
          onSelect(member);
        }}
      />

      {/* TODO(burdon): Show player avatar. */}
      <div className={classes.icon}>
        { value ? (
          <MemberAvatar member={value} />
        ) : (
          <Avatar style={getAvatarStyle(theme)}>
            <FaceIcon />
          </Avatar>
        )

        }

        {/* <SecurityIcon fontSize='large' /> */}
      </div>
    </div>
  );
};

// TODO(burdon): Pass in current state.
const ChessSettings = ({ party, white, black, setPlayers, playerSelectDisabled }) => {
  const classes = useStyles();

  const members = [...party.members].sort(sorter);

  return (
    <div className={classes.root}>
      <PlayerSelector
        disabled={playerSelectDisabled}
        members={members}
        label='White pieces'
        value={white}
        onSelect={publicKey => setPlayers({ black, white: publicKey || undefined })}
      />

      <PlayerSelector
        disabled={playerSelectDisabled}
        members={members}
        label='Black pieces'
        value={black}
        onSelect={publicKey => setPlayers({ white, black: publicKey || undefined })}
      />
    </div>
  );
};

export default ChessSettings;
