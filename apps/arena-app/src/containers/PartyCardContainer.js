//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { keyToString } from '@dxos/crypto';

import { useViews } from '../model';
import { PartyCard } from '@dxos/react-appkit';

const PartyCardContainer = ({ party }) => {
  const topic = keyToString(party.publicKey);
  const { model, createView } = useViews(topic);
  return (
    <PartyCard party={party} viewModel={model} createView={createView} />
  );
};

export default PartyCardContainer;
