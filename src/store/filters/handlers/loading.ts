/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file loading.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Loading handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { EFiltersAction } from '../actions';
import { type TFiltersStoreState } from '../data';

type TLoadingPayload = {};

export type TLoadingAction = {
  type: typeof EFiltersAction.Loading;
  payload: TLoadingPayload;
};

export const loading: IBasicStoreHandler<TFiltersStoreState, TLoadingPayload, EFiltersAction> = {
  dispatch: () => basicDispatcher(EFiltersAction.Loading, () => ({})),

  reduce: state => {
    return {
      ...state,
      loading: true,
    };
  },
};
