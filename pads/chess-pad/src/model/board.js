//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';

export const BOARD_TYPE = 'testing.planner.Board';

/**
 *
 * @returns {ViewModel<{ description: string }>}
 */
export function useBoard (topic, viewId) {
  const model = useModel({ model: ViewModel, options: { type: BOARD_TYPE, topic, viewId } });
  return model ?? new ViewModel();
}
