/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file loading.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Loading handler.
 */

import {
  basicDispatcher,
  type TStoreAction,
  type IBasicStoreHandler,
  type TNoDispatcherArgs,
} from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { type TStoreState } from '../data';

const action = EActionType.Loading;

type TPayload = {};

export type TLoadingAction = TStoreAction<typeof action, TPayload>;

export const loading: IBasicStoreHandler<TStoreState, EActionType, TPayload, TNoDispatcherArgs> = {
  action,

  dispatch: () => basicDispatcher(action, () => ({})),

  reduce: state => {
    return {
      ...state,
      loading: true,
    };
  },
};
