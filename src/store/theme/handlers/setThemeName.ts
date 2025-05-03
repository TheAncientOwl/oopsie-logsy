/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file setThemeName.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description SetThemeName action.
 */

import { modifyWhereId, UUID } from '@/store/common/identifier';
import { EActionType } from '../actions';
import { basicDispatcher, IBasicStoreHandler, TStoreAction } from '@/store/common/storeHandler';
import { TStoreState } from '../data';

const action = EActionType.SetThemeName;

type TPayload = {
  targetThemeId: UUID;
  newName: string;
};

export type TSetThemeNameAction = TStoreAction<typeof action, TPayload>;

export const setThemeName: IBasicStoreHandler<
  TStoreState,
  EActionType,
  TPayload,
  [targetThemeId: UUID, newName: string]
> = {
  action,

  dispatch: (targetThemeId, newName) => basicDispatcher(action, () => ({ targetThemeId, newName })),

  reduce: (state, payload) => {
    const { targetThemeId, newName } = payload;

    const newThemes = modifyWhereId(state.themes, targetThemeId, oldTheme => ({
      ...oldTheme,
      name: newName,
    }));

    return {
      ...state,
      themes: newThemes,
    };
  },
};
