//
// Copyright 2020 DXOS.org
//

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useLayoutEffect } from 'react';

const INITIAL_STATE = [undefined, undefined];

// TODO(burdon): Comment.
export function useAsync (execute, deps) {
  const [state, setState] = useState(INITIAL_STATE);

  useLayoutEffect(() => {
    setState(INITIAL_STATE);

    let cancelled = false;

    execute().then(
      result => cancelled === false && setState([result, undefined]),
      err => cancelled === false && setState([undefined, err])
    );

    return () => { cancelled = true; };
  }, deps);

  return state;
}
