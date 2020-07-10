//
// Copyright 2020 DXOS.org
//

import { useState } from 'react';

/**
 * Executes an action when component is first rendered
 * @param {Function} fn
 */
export function useOnFirstRender (fn) {
  useState(fn);
}
