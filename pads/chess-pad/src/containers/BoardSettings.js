//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { Divider, Drawer, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DeleteConfirmation } from '@dxos/react-ux';

import Input from '../components/Input';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 320
  },
  drawerBox: {
    padding: 20
  },
  drawerField: {
    '&:not(:last-child)': {
      marginBottom: 20
    }
  }
}));

const BoardSettings = ({ isOpen, board, onRename, onUpdate, onDelete, onClose }) => {
  const classes = useStyles();
  const { displayName, metadata: { description = '' } } = board;

  const Header = () => (
    <div className={classes.drawerBox}>
      <Typography variant="h6" color="inherit">
        Board Settings
      </Typography>
    </div>
  );

  const Metadata = () => (
    <div className={classes.drawerBox}>
      <Input
        label="Board Name"
        className={classes.drawerField}
        key={displayName}
        value={displayName || ''}
        onUpdate={title => onRename(title)}
      />
      <Input
        label="Board Description"
        multiline
        className={classes.drawerField}
        key={description}
        value={description ?? ''}
        onUpdate={description => onUpdate({ description })}
      />
    </div>
  );

  const Deletion = () => (
    <div className={classes.drawerBox}>
      <DeleteConfirmation
        deleteLabel="Archive Board..."
        confirmLabel="Archive"
        restoreLabel="Unarchive Board"
        deletedMessage="Board succesfully archived!"
        restoredMessage="Board succesfully restored!"
        isDeleted={board.deleted}
        onDelete={onDelete}
        onRestore={() => console.log('Not implemented')}
      />
    </div>
  );

  return (
    <Drawer open={isOpen} anchor="right" onClose={onClose}>
      <div className={classes.drawer}>
        <Header />
        <Divider />
        <Metadata />
        <Divider />
        <Deletion />
      </div>
    </Drawer>
  );
};

export default BoardSettings;
