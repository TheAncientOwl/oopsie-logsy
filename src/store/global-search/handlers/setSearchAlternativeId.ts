/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2026                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setSearchAlternativeId.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetAlternativeID handler.
 */

import { basicDispatcher, IBasicStoreHandler, TStoreAction } from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { TStoreState } from '../data';

const action = EActionType.SetAlternativeID;

type TPayload = {
  alternativeId: string;
};

export type TSetAlternativeTagIdAction = TStoreAction<typeof action, TPayload>;

export const setSearchAlternativeId: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [alternativeId: string]
> = {
  action,

  dispatch: alternativeId => basicDispatcher(action, () => ({ alternativeId })),

  reduce: (state, payload) => {
    const { alternativeId } = payload;
    return {
      ...state,
      alternativeId,
    };
  },
};
