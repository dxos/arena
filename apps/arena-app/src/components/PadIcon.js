//
// Copyright 2020 DXOS.org
//

import { usePads } from '@dxos/react-appkit';

import React from 'react';

const PadIcon = ({ type }) => {
  const [pads] = usePads();
  const pad = pads.find(pad => pad.type === type);
  return pad ? <pad.icon /> : null;
};

export default PadIcon;
