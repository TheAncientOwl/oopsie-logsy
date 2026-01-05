/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2026                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setSearchPattern.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description .
 */

import { basicDispatcher, IBasicStoreHandler, TStoreAction } from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { TStoreState } from '../data';

const action = EActionType.SetSearchPattern;

type TPayload = {
  searchPattern: string;
};

export type TSetSearchPatternTagAction = TStoreAction<typeof action, TPayload>;

export const setSearchPattern: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [searchPattern: string]
> = {
  action,

  dispatch: searchPattern => basicDispatcher(action, () => ({ searchPattern })),

  reduce: (state, payload) => {
    const { searchPattern } = payload;
    return {
      ...state,
      searchPattern,
    };
  },
};
