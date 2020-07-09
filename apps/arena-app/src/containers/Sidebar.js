//
// Copyright 2018 DXOS.org
//

import assert from 'assert';
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import { Divider } from '@material-ui/core';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

import { PartyTreeAddItemButton, PartyTreeItem, useAppRouter, usePads, MemberList } from '@dxos/react-appkit';
import { useParty } from '@dxos/react-client';

import NewViewCreationMenu from '../components/NewViewCreationMenu';
import { useViews } from '../model';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    flex: 1
  },
  homeButtonLabel: {
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  homeButtonIcon: {
    marginRight: 8
  }
}));

const useHomeTreeItemStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1)
  },

  content: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular
    }
  },

  label: {
    fontWeight: 'inherit',
    color: 'inherit',
    overflow: 'hidden'
  }
}));

const Sidebar = () => {
  const router = useAppRouter();
  const party = useParty();
  const classes = useStyles();
  const homeTreeItemStyles = useHomeTreeItemStyles();
  const { topic, item: active } = useParams();
  const [pads] = usePads();
  const { model, createView } = useViews(topic);
  const [newViewCreationMenuOpen, setNewViewCreationMenuOpen] = useState(false);
  const anchor = useRef();

  const handleSelect = (viewId) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type) => {
    assert(type);
    setNewViewCreationMenuOpen(false);
    const viewId = createView(type);
    handleSelect(viewId);
  };

  return (
    <div className={classes.root}>
      <TreeView>
        <TreeItem
          classes={homeTreeItemStyles}
          nodeId={'__home__'}
          label={(
            <div className={classes.homeButtonLabel} onClick={() => router.push({ path: '/landing' })}>
              <Home className={classes.homeButtonIcon} />
              <Typography variant="body2">Home</Typography>
            </div>
          )}
        />

        {model.getAllViews().map(view => (
          <PartyTreeItem
            key={view.viewId}
            id={view.viewId}
            label={view.displayName}
            icon={pads.find(pad => pad.type === view.type)?.icon}
            isSelected={active === view.viewId}
            onSelect={() => handleSelect(view.viewId)}
            onUpdate={(title) => model.renameView(view.viewId, title)}
          />
        ))}

        <PartyTreeAddItemButton ref={anchor} topic={topic} onClick={() => setNewViewCreationMenuOpen(true)}>Item</PartyTreeAddItemButton>
        <NewViewCreationMenu anchorEl={anchor.current} open={newViewCreationMenuOpen} onSelect={handleCreate} onClose={() => setNewViewCreationMenuOpen(false)} />
      </TreeView>
      <Divider />
      <MemberList party={party} />
    </div>
  );
};

export default Sidebar;
