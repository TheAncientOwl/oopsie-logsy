/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterIgnoreCase.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description ToggleFilterIgnoreCase handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type ToggleFilterIgnoreCasePayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface ToggleFilterIgnoreCaseAction {
  type: ActionType.ToggleFilterIgnoreCase;
  payload: ToggleFilterIgnoreCasePayload;
}

export const toggleFilterIgnoreCase: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterIgnoreCasePayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.ToggleFilterIgnoreCase, () => ({
      targetTabId,
      targetFilterId,
    })),

  reduce: (state, payload) => {
    const { targetTabId, targetFilterId } = payload;

    const newTabs = state.filterTabs.map(tab =>
      tab.id !== targetTabId
        ? tab
        : {
            ...tab,
            filters: tab.filters.map(filter =>
              filter.id !== targetFilterId
                ? filter
                : {
                    ...filter,
                    ignoreCase: !filter.ignoreCase,
                  }
            ),
          }
    );

    return {
      ...state,
      filterTabs: newTabs,
      canSaveTabs: checkCanSaveTabs(newTabs),
    };
  },
};
