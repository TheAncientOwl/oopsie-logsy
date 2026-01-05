/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file searchLoading.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Loading handler.
 */

import {
  basicDispatcher,
  type IBasicStoreHandler,
  type TStoreAction,
  type TNoDispatcherArgs,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { type TStoreState } from '../data';

const action = EActionType.SearchLoading;

type TPayload = {};

export type TSearchLoadingAction = TStoreAction<typeof action, TPayload>;

export const searchLoading: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  TNoDispatcherArgs
> = {
  action,

  dispatch: () => basicDispatcher(action, () => ({})),

  reduce: state => {
    return {
      ...state,
      searchLoading: true,
    };
  },
};
