//
// Copyright 2020 Wireline, Inc.
//

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

import { ReactComponent as KingBlackIcon } from '../assets/king-black.svg';

const KingBlack = (props) => (
  <SvgIcon {...props} viewBox="0 0 45 45" component={KingBlackIcon} />
);

export default KingBlack;
