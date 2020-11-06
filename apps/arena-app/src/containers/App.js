//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { keyToBuffer } from '@dxos/crypto';
import { AppContainer, usePads, useAppRouter, DefaultItemList, DefaultSettingsDialog } from '@dxos/react-appkit';
import { useItems } from '@dxos/react-client';

debug.enable('dxos:*');

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },

  titleRoot: {
    color: theme.palette.primary.contrastText,
    display: 'inline-block',
    lineHeight: '48px'
  }
}));

const App = () => {
  const router = useAppRouter();
  const classes = useStyles();
  const { topic, item: itemId } = useParams();
  const [pads] = usePads();
  const items = useItems({ partyKey: keyToBuffer(topic), type: pads.map(pad => pad.type) });
  const item = items.find(i => i.id === itemId);
  const [itemSettingsOpen, setItemSettingsOpen] = useState(false);

  if (!item) return null;
  const pad = pads.find(pad => pad.type === item.type);
  const Settings = (pad && pad.settings) ? pad.settings : DefaultSettingsDialog;

  return (
    <>
      <AppContainer
        sidebarContent={<DefaultItemList />}
        onSettingsOpened={() => setItemSettingsOpen(true)}
        onHomeNavigation={() => router.push({ path: '/home' })}
      >
        <div className={classes.main}>
          {pad && <pad.main topic={topic} itemId={itemId} item={item} />}
        </div>
      </AppContainer>
      <Settings
        topic={topic}
        open={itemSettingsOpen}
        onClose={() => setItemSettingsOpen(false)}
        onCancel={() => setItemSettingsOpen(false)}
        item={item}
        Icon={pad && pad.icon}
      />
    </>
  );
};

export default App;
