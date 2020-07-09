//
// Copyright 2020 DXOS.org
//

import { useModel } from '@dxos/react-client';
import { ObjectModel } from '@dxos/echo-db';

export const LIST_TYPE = 'testing.planner.List';
export const CARD_TYPE = 'testing.planner.Card';

export function useList (topic, viewId) {
  const model = useModel({ model: ObjectModel, options: { type: [LIST_TYPE, CARD_TYPE], topic, viewId } });
  return model ?? new ObjectModel();
}
