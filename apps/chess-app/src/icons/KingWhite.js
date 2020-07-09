//
// Copyright 2020 DXOS.org
//

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

import { ReactComponent as KingWhiteIcon } from '../assets/king-white.svg';

const KingWhite = (props) => (
  <SvgIcon {...props} viewBox="0 0 45 45" component={KingWhiteIcon} />
);

export default KingWhite;
