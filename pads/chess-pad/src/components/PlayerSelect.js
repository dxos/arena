//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { humanize } from '@dxos/crypto';
import { useParty } from '@dxos/react-client';

import KingWhite from '../icons/KingWhite';
import KingBlack from '../icons/KingBlack';

const sorter = (a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : a.isMe ? -1 : 1);

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 300,
    textAlign: 'center',
    justifyContent: 'space-between'
  },
  itemText: {
    paddingRight: 150
  },
  actions: {
    justifyContent: 'center'
  }
}));

const PlayerSelect = ({ onSelected }) => {
  const party = useParty();
  const [{ black, white }, setPlayers] = useState({});
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader title="Select players" />
      <CardContent>
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
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          variant="outlined"
          disabled={!white || !black}
          onClick={() => onSelected({ white, black })}
        >
          Select
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlayerSelect;
