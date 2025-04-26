/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file focusFilterTab.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description FocusFilterTab handler.
 */

import { type UUID } from '@/store/common/identifier';
import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { type TStoreState } from '../data';

const action = EActionType.FocusFilterTab;

type TPayload = {
  targetId: UUID;
};

export type TFocusFilterTabAction = TStoreAction<typeof action, TPayload>;

export const focusFilterTab: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetId: UUID]
> = {
  action,

  dispatch: targetId => basicDispatcher(action, () => ({ targetId })),

  reduce: (state, payload) => {
    const { targetId } = payload;

    return {
      ...state,
      focusedTabId: targetId,
    };
  },
};
