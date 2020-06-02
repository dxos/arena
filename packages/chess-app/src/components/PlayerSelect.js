//
// Copyright 2020 Wireline, Inc.
//

import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import { humanize } from '@dxos/crypto';
import { useParty } from '@dxos/react-client';

import KingWhite from '../icons/KingWhite';
import KingBlack from '../icons/KingBlack';

const sorter = (a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : a.isMe ? -1 : 1);

const useStyles = makeStyles(() => ({
  itemText: {
    paddingRight: 150,
  },
}));

export const PlayerSelect = ({ isVisible, onSelected }) => {
  const party = useParty();
  const [{ black, white }, setPlayers] = useState({});
  const classes = useStyles();

  return (
    <Dialog open={isVisible}>
      <DialogTitle>Choose players</DialogTitle>
      <List>
        {party.members.sort(sorter).map(member => (
          <ListItem key={member.publicKey}>
            <ListItemText primary={member.displayName || humanize(member.publicKey)} className={classes.itemText} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => setPlayers({ black, white: member.publicKey })}>
                <KingWhite style={{ opacity: white && member.publicKey.equals(white) ? 1 : 0.1 }} />
              </IconButton>
              <IconButton onClick={() => setPlayers({ white, black: member.publicKey })}>
                <KingBlack style={{ opacity: black && member.publicKey.equals(black) ? 1 : 0.1 }} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button
          onClick={() => onSelected(undefined)}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={!white || !black}
          onClick={() => onSelected({ white, black })}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
