//
// Copyright 2019 Wireline, Inc.
//

import React, { Fragment, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { keyToString } from '@dxos/crypto';
import { PartyTree, PartyTreeItem, PartyTreeAddItemButton, useAppRouter, useItems, usePads } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';

import { makeStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';

import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';

const useStyles = makeStyles(theme => ({
  padItemsMenuList: {
    padding: 0
  },
  padItemsMenuItem: {
    padding: '6px 12px'
  },
  padItemsMenuIcon: {
    paddingRight: theme.spacing()
  }
}));

const CreateItem = ({ topic, onCreate, pads }) => {
  const history = useHistory();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCreateItem = useCallback(type => () => {
    onCreate(type);
    setAnchorEl(null);
  }, [onCreate]);

  const handleGoToDashboard = useCallback(() => {
    history.push(`/app/${topic}`);
  }, [history, topic]);

  if (pads.length === 0) {
    return (
      <PartyTreeAddItemButton onClick={handleGoToDashboard}>
        Install new apps
      </PartyTreeAddItemButton>
    );
  }

  return (
    <Fragment>
      <PartyTreeAddItemButton onClick={handleClick}>
        Item
      </PartyTreeAddItemButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{
          list: classes.padItemsMenuList
        }}
      >
        {
          pads.map((pad, index) => {
            const Icon = pad.icon || AddIcon;
            return (
              <MenuItem
                key={index}
                onClick={handleCreateItem(pad.type)}
                className={classes.padItemsMenuItem}
                disableGutters
              >
                <Icon className={classes.padItemsMenuIcon} />
                <ListItemText primary={pad.displayName} />
              </MenuItem>
            );
          })
        }
      </Menu>
    </Fragment>
  );
};

/**
 * Items list.
 * @param {string} topic Current topic.
 */
const Items = ({ topic }) => {
  const { item: active } = useParams();
  const history = useHistory();

  const [pads] = usePads();
  const { items, createItem } = useItems({ topic });

  const handleSelect = (itemId, name) => () => {
    if (!name) {
      return;
    }
    history.push(`/app/${topic}/${name}/${itemId}`);
  };

  return (
    <Fragment>
      {items.map(item => {
        const pad = pads.find(pad => pad.type === item.__type_url);

        if (!pad) {
          // Removed app
          return (
            <PartyTreeItem
              key={item.id}
              id={item.id}
              label={item.title || item.id}
              icon={BlockIcon}
              isSelected={active === item.id}
              onSelect={handleSelect(item.id)}
            />
          );
        }

        const { icon: Icon, name } = pad;

        return (
          <PartyTreeItem
            key={item.id}
            id={item.id}
            label={item.title || item.id}
            icon={Icon}
            isSelected={active === item.id}
            onSelect={handleSelect(item.id, name)}
          />
        );
      })}
      <CreateItem onCreate={createItem} topic={topic} pads={pads} />
    </Fragment>
  );
};

const Sidebar = () => {
  const client = useClient();
  const parties = useParties();
  const router = useAppRouter();
  const { topic } = useParams();

  const handleSelect = (topic) => {
    router.push({ topic });
  };

  const handleCreate = async () => {
    const party = await client.partyManager.createParty();
    handleSelect(keyToString(party.publicKey));
  };

  return (
    <PartyTree
      parties={parties}
      items={topic => <Items topic={topic} />}
      selected={topic}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};

export default Sidebar;
