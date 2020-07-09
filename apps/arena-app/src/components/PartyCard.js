//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import assert from 'assert';

import React, { useState, useRef } from 'react';

import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Clear';
import RestoreIcon from '@material-ui/icons/RestoreFromTrash';

import { keyToString } from '@dxos/crypto';
import { useAppRouter } from '@dxos/react-appkit';
import { useClient } from '@dxos/react-client';
import { EditableText } from '@dxos/react-ux';

import { useViews } from '../model';

// TODO(burdon): Component should not import container.
import SettingsDialog from '../containers/SettingsDialog';
import { getThumbnail } from '../util/images';

import NewViewCreationMenu from './NewViewCreationMenu';
import PartySettingsMenu from './PartySettingsMenu';
import PartyMemberList from './PartyMemberList';
import PadIcon from './PadIcon';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: 300
  },

  unsubscribed: {
    '& img': {
      '-webkit-filter': 'grayscale(100%)',
      opacity: 0.7
    }
  },

  headerRoot: {
    height: 62 // Prevent collapse if menu icon isn't present (if not subscribed).
  },
  headerContent: {
    overflow: 'hidden'
  },
  headerAction: {
    margin: 0
  },

  actions: {
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },

  listContainer: {
    height: 176, // 5 * 36
    marginBottom: theme.spacing(1),
    overflowY: 'scroll'
  },
  list: {
    // paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(2)
  }
}));

// TODO(burdon): Move to react-appkit.
const PartyCard = ({ party }) => {
  const classes = useStyles();
  const [newViewCreationMenuOpen, setNewViewCreationMenuOpen] = useState(false);
  const [partySettingsMenuOpen, setPartySettingsMenuOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deletedItemsVisible, setDeletedItemsVisible] = useState(false);
  const createViewAnchor = useRef();
  const settingsMenuAnchor = useRef();

  // TODO(burdon): This should be a dumb component (not container), so must pass in handlers.
  const topic = keyToString(party.publicKey);
  const { model, createView } = useViews(topic);
  const client = useClient();
  const router = useAppRouter();

  const handleSelect = (viewId) => {
    router.push({ topic, item: viewId });
  };

  const handleCreate = (type) => {
    assert(type);
    setNewViewCreationMenuOpen(false);
    const viewId = createView(type);
    handleSelect(viewId);
  };

  const handleSubscribe = async () => {
    await client.partyManager.subscribe(party.publicKey);
  };

  const handleUnsubscribe = async () => {
    await client.partyManager.unsubscribe(party.publicKey);
  };

  // TODO(burdon): Only update name via settings.
  return (
    <>
      <Card className={clsx(classes.card, !party.subscribed && classes.unsubscribed)}>
        <CardHeader
          classes={{
            root: classes.headerRoot,
            content: classes.headerContent,
            action: classes.headerAction
          }}
          title={
            <EditableText
              disabled={!party.subscribed}
              value={party.displayName}
              onUpdate={(displayName) => client.partyManager.setPartyProperty(party.publicKey, { displayName })}
            />
          }
          action={
            party.subscribed && (
              <IconButton
                size="small"
                aria-label="party menu"
                ref={settingsMenuAnchor}
                onClick={() => setPartySettingsMenuOpen(true)}
              >
                <MoreVertIcon />
              </IconButton>
            )
          }
        />

        <CardMedia
          component="img"
          height={120}
          image={getThumbnail(party.displayName)}
        />

        <div className={classes.listContainer}>
          <List className={classes.list} dense={true} disablePadding={true}>
            {model.getAllViews().map(item => (
              <ListItem
                key={item.viewId}
                button
                disabled={!party.subscribed}
                onClick={() => handleSelect(item.viewId)}
              >
                <ListItemIcon>
                  <PadIcon type={item.type} />
                </ListItemIcon>
                <ListItemText>
                  {item.displayName}
                </ListItemText>
                {party.subscribed && (
                  <ListItemSecondaryAction>
                    <IconButton size="small" edge="end" aria-label="delete" onClick={() => model.deleteView(item.viewId)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}

            {party.subscribed && deletedItemsVisible && model.getAllDeletedViews().map(item => (
              <ListItem key={item.viewId} disabled={true}>
                <ListItemIcon>
                  <PadIcon type={item.type} />
                </ListItemIcon>
                <ListItemText>
                  {item.displayName}
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="restore" onClick={() => model.restoreView(item.viewId)}>
                    <RestoreIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>

        <CardActions className={classes.actions}>
          {party.subscribed && (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShareDialogOpen(true)}
              >
              Share
              </Button>

              <PartyMemberList party={party} />

              <IconButton
                ref={createViewAnchor}
                size="small"
                edge="end"
                aria-label="add view"
                onClick={() => setNewViewCreationMenuOpen(true)}
              >
                <AddIcon />
              </IconButton>
            </>
          )}

          {!party.subscribed && (
            <Button
              size="small"
              color="secondary"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>
          )}
        </CardActions>
      </Card>

      <NewViewCreationMenu
        anchorEl={createViewAnchor.current}
        open={newViewCreationMenuOpen}
        onSelect={handleCreate}
        onClose={() => setNewViewCreationMenuOpen(false)}
      />

      <PartySettingsMenu
        anchorEl={settingsMenuAnchor.current}
        open={partySettingsMenuOpen}
        deletedItemsVisible={deletedItemsVisible}
        onClose={() => setPartySettingsMenuOpen(false)}
        onVisibilityToggle={() => setDeletedItemsVisible(prev => !prev)}
        onUnsubscribe={handleUnsubscribe}
      />

      {/* TODO(burdon): Move to Home (i.e., single instance. */}
      <SettingsDialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} party={party} />
    </>
  );
};

export default PartyCard;
