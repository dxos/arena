//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { useTheme } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';

import { red, pink, deepPurple, deepOrange, indigo, blue, cyan, teal, green, amber } from '@material-ui/core/colors';

const depth = 500;

const COLORS = [
  deepOrange[depth],
  deepPurple[depth],
  red[depth],
  pink[depth],
  indigo[depth],
  blue[depth],
  cyan[depth],
  teal[depth],
  green[depth],
  amber[depth]
];

const getColor = publicKey => COLORS[parseInt(publicKey.toString('hex').slice(0, 4), 16) % COLORS.length];

export const getAvatarStyle = (theme, publicKey) => {
  const color = getColor(publicKey);
  return {
    backgroundColor: color,
    color: theme.palette.getContrastText(color)
  };
};

const MemberAvatar = ({ member }) => (
  <Avatar style={getAvatarStyle(useTheme(), member.publicKey)}>
    {member.displayName ? member.displayName.slice(0, 1).toUpperCase() : <FaceIcon />}
  </Avatar>
);

export default MemberAvatar;
