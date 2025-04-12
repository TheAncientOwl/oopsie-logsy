/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file toggleFilterHighlight.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description ToggleFilterHighlight handler.
 */

import { basicDispatcher, IBasicStoreHandler } from '@/store/common/storeHandler';
import { ActionType } from '../actions';
import { checkCanSaveTabs, IDefaultState } from '../data';

type ToggleFilterHighlightPayload = {
  targetTabId: string;
  targetFilterId: string;
};

export interface ToggleFilterHighlightAction {
  type: ActionType.ToggleFilterHighlightOnly;
  payload: ToggleFilterHighlightPayload;
}

export const toggleFilterHighlightOnly: IBasicStoreHandler<
  IDefaultState,
  ToggleFilterHighlightPayload,
  ActionType
> = {
  dispatch: (targetTabId: string, targetFilterId: string) =>
    basicDispatcher(ActionType.ToggleFilterHighlightOnly, () => ({
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
                    isHighlightOnly: !filter.isHighlightOnly,
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
