/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file loading.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Loading handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ELogRegexTagsAction } from '../actions';
import { type TLogRegexTagsStoreState } from '../data';

type TLoadingPayload = {};

export type TLoadingAction = {
  type: typeof ELogRegexTagsAction.Loading;
  payload: TLoadingPayload;
};

export const loading: IBasicStoreHandler<
  TLogRegexTagsStoreState,
  TLoadingPayload,
  ELogRegexTagsAction
> = {
  dispatch: () => basicDispatcher(ELogRegexTagsAction.Loading, () => ({})),

  reduce: state => {
    return {
      ...state,
      loading: true,
    };
  },
};
