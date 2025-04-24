/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file focusFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description FocusFilterTab handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { type TFiltersStoreState } from '../data';

type TFocusFilterTabPayload = {
  targetId: string;
};

export type TFocusFilterTabAction = {
  type: EFiltersAction.FocusFilterTab;
  payload: TFocusFilterTabPayload;
};

export const focusFilterTab: IBasicStoreHandler<
  TFiltersStoreState,
  TFocusFilterTabPayload,
  EFiltersAction
> = {
  dispatch: (targetId: string) =>
    basicDispatcher(EFiltersAction.FocusFilterTab, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;

    return {
      ...state,
      focusedTabId: targetId,
    };
  },
};
