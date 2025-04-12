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

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { IDefaultState } from '../data';

export type LoadingPayload = undefined;

export interface LoadingAction {
  type: typeof ActionType.Loading;
  payload: LoadingPayload;
}

export const loading: IBasicStoreHandler<IDefaultState, LoadingPayload, ActionType> = {
  dispatch: () => basicDispatcher(ActionType.Loading, () => undefined),

  reduce: state => {
    return {
      ...state,
      loading: true,
    };
  },
};
