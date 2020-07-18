//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
  container: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: 8
  }
}));

// TODO(burdon): Change to Popover.
const PromotionSelect = ({ isVisible, onSelect }) => {
  const classes = useStyles();
  return (
    <Modal
      open={isVisible}
      onClose={() => onSelect(undefined)}
    >
      <div className={classes.container}>
        <Button variant="contained" onClick={() => onSelect('q')}>Queen</Button>
        <Button variant="contained" onClick={() => onSelect('r')}>Rook</Button>
        <Button variant="contained" onClick={() => onSelect('n')}>Knight</Button>
        <Button variant="contained" onClick={() => onSelect('b')}>Bishop</Button>
      </div>
    </Modal>
  );
};

export default PromotionSelect;
