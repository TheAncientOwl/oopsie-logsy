/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file focusFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description FocusFilterTab handler.
 */

import { basicDispatcher, IStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type FocusFilterTabPayload = {
  targetId: string;
};

export interface FocusFilterTabAction {
  type: ActionType.FilterTabFocus;
  payload: FocusFilterTabPayload;
}

export const focusFilterTab: IStoreHandler<IDefaultState, FocusFilterTabPayload, ActionType> = {
  dispatch: (targetId: string) => basicDispatcher(ActionType.FilterTabFocus, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;

    return {
      ...state,
      focusedTabId: targetId,
    };
  },
};
