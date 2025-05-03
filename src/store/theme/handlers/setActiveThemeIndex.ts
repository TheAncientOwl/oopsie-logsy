/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setActiveThemeIndex.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetActiveThemeIndex handler.
 */

import { basicDispatcher, IBasicStoreHandler, TStoreAction } from '@/store/common/storeHandler';
import { EActionType } from '../actions';
import { TStoreState } from '../data';

const action = EActionType.SetActiveThemeIndex;

type TPayload = {
  index: number;
};

export type TSetActiveThemeIndexAction = TStoreAction<typeof action, TPayload>;

export const setActiveThemeIndex: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [index: number]
> = {
  action,

  dispatch: index => basicDispatcher(action, () => ({ index })),

  reduce: (state, payload) => {
    const { index } = payload;

    if (index < 0 || index >= state.themes.length) {
      console.warn(setActiveThemeIndex.reduce, `Cannot set invalid theme index  ${index}`);
      return state;
    }

    if (index === state.activeThemeIndex) {
      return state;
    }

    return {
      ...state,
      activeThemeIndex: index,
    };
  },
};
