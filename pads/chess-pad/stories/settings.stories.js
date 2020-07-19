//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { storiesOf } from '@storybook/react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { createId } from '@dxos/crypto';

import ChessSettings from '../src/components/ChessSettings';

storiesOf('Settings', module)
  .add('Board', () => {
    const party = {
      members: [...new Array(5)].map((_, i) => ({
        publicKey: createId(),
        displayName: i < 2 && `Member ${i}`
      }))
    };

    return (
      <Box m={2}>
        <Card>
          <CardContent>
            <ChessSettings party={party} />
          </CardContent>
        </Card>
      </Box>
    );
  });
