//
// Copyright 2018 DXOS.org
//

import clsx from 'clsx';
import React from 'react';

import { Typography, Card as MuiCard } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
    padding: 20
  }
}));

const InnerCard = (props) => {
  const { card } = props;
  return <Typography variant="body1">{card.title}</Typography>;
};

const MiniCard = (props) => {
  const classes = useStyles();
  const { className, style, onOpenCard, card } = props;

  return (
    <MuiCard className={clsx(classes.root, className)} onMouseUp={onOpenCard}>
      <InnerCard style={style} classes={classes} card={card} />
    </MuiCard>
  );
};

export default MiniCard;
