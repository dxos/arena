//
// Copyright 2019 Wireline, Inc.
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: 100,
    borderLeft: '1px solid #EEE',
    backgroundColor: '#F5F5F5',
    overflowY: 'scroll',
    paddingRight: 16
  },

  table: {
    width: '100%',

    '& td': {
      textAlign: 'right'
    }
  }
}));

export default function MovesPad({ history }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <table className={classes.table}>
        <tbody>
          {history.map(({ from, to }, i) => (
            <tr key={i}>
              <td>{i + 1}.</td>
              <td>{from}</td>
              <td>{to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
