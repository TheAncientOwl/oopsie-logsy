/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file focusFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description FocusFilterTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

type FocusFilterTabPayload = {
  targetId: string;
};

export interface FocusFilterTabAction {
  type: ActionType.FocusFilterTab;
  payload: FocusFilterTabPayload;
}

export const focusFilterTab: IBasicStoreHandler<IDefaultState, FocusFilterTabPayload, ActionType> =
  {
    dispatch: (targetId: string) =>
      basicDispatcher(ActionType.FocusFilterTab, () => ({ targetId })),

    reduce: (state, payload) => {
      const { targetId } = payload;

      return {
        ...state,
        focusedTabId: targetId,
      };
    },
  };
