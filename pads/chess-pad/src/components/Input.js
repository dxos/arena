//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
  input: {
    flexGrow: 1,
    display: 'flex'
  }
}));

/**
 * Editable text field.
 */
const Input = (props) => {
  const classes = useStyles();
  const { className, value, onUpdate, multiline, ...textFieldProps } = props;

  const [text, setText] = useState(value);
  const original = value;

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event) => {
    const { target, key } = event;
    const { value } = target;

    switch (key) {
      case 'Enter': {
        if (!multiline || event.metaKey) {
          setText(value);
          onUpdate(value);
        }
        break;
      }

      case 'Escape': {
        setText(original);
        break;
      }

      default:
    }
  };

  const handleBlur = () => onUpdate(text);

  return (
    <TextField
      className={clsx(classes.input, className)}
      value={text}
      multiline={multiline}
      variant="outlined"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      inputProps={{ spellCheck: 'false' }}
      {...textFieldProps}
    />
  );
};

export default Input;
