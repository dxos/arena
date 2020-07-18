//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import { noop } from '@dxos/async';
import { keyToBuffer } from '@dxos/crypto';
import { useClient } from '@dxos/react-client';
import {
  AppContainer,
  DefaultViewSidebar,
  ViewSettingsDialog,
  usePads,
  useAppRouter,
  useViews
} from '@dxos/react-appkit';

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
  const { topic, item: viewId } = useParams();
  const [pads] = usePads();
  const { model } = useViews(topic);
  const item = model.getById(viewId);
  const client = useClient();
  const [viewSettingsOpen, setViewSettingsOpen] = useState(false);

  const pad = item ? pads.find(pad => pad.type === item.type) : undefined;

  // TODO(burdon): Create hook.
  useEffect(() => {
    if (topic) {
      client.partyManager.openParty(keyToBuffer(topic)).then(noop);
    }
  }, [topic]);

  // TODO(burdon): Move to appkit.
  const AppBarContent = () => {
    return (
      <>
        <IconButton color="inherit">
          <Home onClick={() => router.push({ path: '/home' })} />
        </IconButton>
        <IconButton color="inherit">
          <SettingsIcon onClick={() => setViewSettingsOpen(true)} />
        </IconButton>
      </>
    );
  };

  return (
    <>
      <AppContainer
        appBarContent={<AppBarContent />}
        sidebarContent={<DefaultViewSidebar />}
      >
        <div className={classes.main}>
          {pad && (
            <pad.main
              topic={topic}
              viewId={viewId}
              viewSettingsOpen={viewSettingsOpen}
              setViewSettingsOpen={setViewSettingsOpen}
            />
          )}
        </div>
      </AppContainer>

      {/* TODO(burdon): Move from here to framework. */}
      {pad && !pad.customViewSettings && (
        <ViewSettingsDialog
          open={viewSettingsOpen}
          onClose={() => setViewSettingsOpen(false)}
          viewModel={model}
          pads={pads}
          viewId={viewId}
        />
      )}
    </>
  );
};

export default App;
