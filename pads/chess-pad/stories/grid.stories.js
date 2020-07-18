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
    return (
      <Box m={2}>
        <ChessGrid />
      </Box>
    );
  });
