//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { storiesOf } from '@storybook/react';

import Box from '@material-ui/core/Box';

import ChessGrid from '../src/components/ChessGrid';

// TODO(burdon): How to test with fake party?
storiesOf('Panels', module)
  .add('Grid', () => {
    const topic = null;
    const boards = null;

    return (
      <Box m={2}>
        <ChessGrid topic={topic} boards={boards} />
      </Box>
    );
  });
